import { FormatIcu } from '@tolgee/format-icu';
import { DevTools, Tolgee } from '@tolgee/web';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const ALL_LOCALES = ['en-US', 'zh-Hans'];

export const DEFAULT_LOCALE = 'en-US';

export const localesTranslations = {
    'en-US': 'English',
    'zh-Hans': '简体中文',
};

export async function getStaticData(languages: string[], namespaces: string[] = ['']) {
    const result: Record<string, any> = {};
    for (const lang of languages) {
        for (const namespace of namespaces) {
            if (namespace) {
                result[`${lang}:${namespace}`] = (await import(`../i18n/${namespace}/${lang}.json`)).default;
            } else {
                result[lang] = (await import(`../i18n/${lang}.json`)).default;
            }
        }
    }
    return result;
}

export function TolgeeBase() {
    return Tolgee().use(FormatIcu()).use(DevTools()).updateDefaults({
        apiKey,
        apiUrl,
        fallbackLanguage: 'en-US',
    });
}
