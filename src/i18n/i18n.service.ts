import { Injectable } from '@nestjs/common';
import ptBR from '@/i18n/translations/pt-BR.json';
import enUS from '@/i18n/translations/en-US.json';

export type Language = 'pt-BR' | 'en-US';
type TranslationKey = string;

@Injectable()
export class I18nService {
    private translations: Record<Language, any> = {
        'pt-BR': ptBR,
        'en-US': enUS,
    };

    private defaultLanguage: Language = 'en-US';

    setDefaultLanguage(language: Language) {
        this.defaultLanguage = language;
    }

    validateLanguage(lang: string | Language): Language {
        if (this.isValidLanguage(lang)) {
            return lang;
        }
        return this.defaultLanguage;
    }

    translate(key: TranslationKey, language?: string | Language, params?: Record<string, any>): string {
        const validatedLanguage = this.validateLanguage(language || this.defaultLanguage);
        let message = this.findTranslation(key, validatedLanguage);

        if (params) {
            Object.keys(params).forEach(param => {
                message = message.replace(`{{${param}}}`, params[param].toString());
            });
        }

        return message;
    }

    private findTranslation(key: TranslationKey, language: Language): string {
        const keys = key.split('.');
        let translation: any = this.translations[language];

        for (const k of keys) {
            translation = translation[k];
            if (translation === undefined) break;
        }

        if (translation === undefined && language !== this.defaultLanguage) {
            return this.findTranslation(key, this.defaultLanguage);
        }

        return translation || key;
    }

    private isValidLanguage(lang: string | Language): lang is Language {
        return lang === 'pt-BR' || lang === 'en-US';
    }
}