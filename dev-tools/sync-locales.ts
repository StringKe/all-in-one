import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import axios, { type AxiosInstance } from 'axios';
import { parse } from 'dotenv';
import { get } from 'lodash-es';

declare type KeyInfo = {
    id: number;

    projectName: string;
    userFullName: string;
    lastUsedAt: number;
    expiresAt: number;
    projectId: number;
    scopes: string[];
    username: string;
    description: string;
};

declare type Language = {
    id: number;
    name: string;
    tag: string;
    originalName: string;
    flagEmoji: string;
    base: boolean;
};

class SyncLocales {
    i18nRoot: string;

    API_KEY: string;
    API_URL: string;

    client: AxiosInstance;
    keyInfo?: KeyInfo;
    languages: Language[] = [];

    constructor() {
        const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
        this.i18nRoot = path.join(projectRoot, '../src/i18n');
        const envFile = path.join(projectRoot, '../.env');
        if (!fs.existsSync(envFile)) {
            throw new Error(`.env file not found at ${envFile}`);
        }
        const envContent = fs.readFileSync(envFile, 'utf-8');
        const env = parse(envContent);
        if (!env.NEXT_PUBLIC_TOLGEE_API_KEY || !env.NEXT_PUBLIC_TOLGEE_API_URL) {
            throw new Error(`.env file must contain NEXT_PUBLIC_TOLGEE_API_KEY and NEXT_PUBLIC_TOLGEE_API_URL variables`);
        }
        this.API_KEY = env.NEXT_PUBLIC_TOLGEE_API_KEY;
        this.API_URL = env.NEXT_PUBLIC_TOLGEE_API_URL;

        this.client = axios.create({
            baseURL: this.API_URL,
            headers: {
                'X-API-Key': this.API_KEY,
            },
        });
    }

    static run() {
        void new SyncLocales().sync();
    }

    async requestKeyInfo() {
        const response = await this.client.get<KeyInfo>('/v2/api-keys/current');
        if (response.status !== 200) {
            throw new Error(`Failed to get key info: ${response.statusText}`);
        }
        this.keyInfo = response.data;
    }

    getProjectId() {
        if (!this.keyInfo) throw new Error('Key info not loaded');
        return this.keyInfo?.projectId;
    }

    async requestLanguages() {
        const getPage = async (page = 0) => {
            const response = await this.client.get<{
                _embedded: {
                    languages: Language[];
                };
                page: {
                    size: number;
                    totalElements: number;
                    totalPages: number;
                    number: number;
                };
            }>(`/v2/projects/${this.getProjectId()}/languages`, {
                params: {
                    page,
                    pageSize: 20,
                },
            });

            if (response.status !== 200) {
                throw new Error(`Failed to get languages: ${response.statusText}`);
            }
            return [response.data._embedded.languages, response.data.page] as const;
        };

        const languages: Language[] = [];
        let page = 0;
        let total = 1;
        while (page < total) {
            const [pageLanguages, pageInfo] = await getPage(page++);
            languages.push(...pageLanguages);
            total = pageInfo.totalPages;
        }
        this.languages = languages;
    }

    async requestTranslation(code: string) {
        const response = await this.client.get<Record<string, any>>(`/v2/projects/${this.getProjectId()}/translations/${code}`);
        if (response.status !== 200) {
            throw new Error(`Failed to get translations for ${code}: ${response.statusText}`);
        }
        return response;
    }

    writeTranslationFile(language: Language, translations: Record<string, any>) {
        const filePath = path.join(this.i18nRoot, `${language.tag}.json`);
        const content = JSON.stringify(translations, null, 4);
        fs.writeFileSync(filePath, content);
        console.log(`Write ${language.name}[${language.tag}] translations to ${filePath}`);
    }

    async sync() {
        await this.requestKeyInfo();
        await this.requestLanguages();

        const json = [];
        for (const language of this.languages) {
            const response = await this.requestTranslation(language.tag);
            const translations = get(response.data, language.tag);
            if (!translations) {
                console.log(`No translations for ${language.tag}`);
                continue;
            }
            this.writeTranslationFile(language, translations);
            json.push({
                flag: language.flagEmoji,
                name: language.name,
                originalName: language.originalName,
                tag: language.tag,
            });
        }

        const languagesJson = JSON.stringify(json, null, 4);
        const languagesPath = path.join(this.i18nRoot, 'languages.json');
        fs.writeFileSync(languagesPath, languagesJson);
    }
}

SyncLocales.run();
