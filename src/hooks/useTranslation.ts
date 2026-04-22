import { useLangStore } from '@/store/langStore';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

const dictionaries = {
  en,
  es,
};

// Función para recursivamente valores de objetos anidados
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object') {
      return acc[part];
    }
    return undefined;
  }, obj);
};

export function useTranslation() {
  const { language } = useLangStore();

  const translations = dictionaries[language];

  const t = (key: string, variables?: Record<string, string>): string => {
    let value = getNestedValue(translations, key);

    if (typeof value !== 'string') {
      return key;
    }

    if (variables) {
      Object.keys(variables).forEach((vKey) => {
        value = value.replace(`{${vKey}}`, variables[vKey]);
      });
    }

    return value;
  };

  return { t, language };
}
