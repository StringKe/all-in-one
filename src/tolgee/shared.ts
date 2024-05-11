import { FormatIcu } from '@tolgee/format-icu';
import { DevBackend, DevTools, Tolgee } from '@tolgee/web';

import languages from '@/i18n/languages.json';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

// noinspection SpellCheckingInspection
export const ALL_LOCALES = languages.map((item) => item.tag);

// noinspection SpellCheckingInspection
export const DEFAULT_LOCALE = languages.find((item) => item.base)?.tag ?? 'en-US';

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
    return Tolgee().use(FormatIcu()).use(DevTools()).use(DevBackend()).updateDefaults({
        apiKey,
        apiUrl,
        fallbackLanguage: 'en-US',
    });
}
