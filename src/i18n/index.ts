import type { SovereignLocale } from '../config/sovereign/jurisdictions.js';
import en, { type MessageKey } from './locales/en.js';
import es from './locales/es.js';

const CATALOGS: Record<SovereignLocale, Record<MessageKey, string>> = {
  en,
  'en-US': en,
  es,
  'es-VE': es,
  'es-CO': es,
};

export type TranslateVars = Record<string, string | number>;

export function translate(
  key: MessageKey,
  locale: SovereignLocale,
  vars?: TranslateVars,
): string {
  const catalog = CATALOGS[locale] ?? en;
  let text = catalog[key] ?? en[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export type TFunction = (key: MessageKey, vars?: TranslateVars) => string;

export function createTranslator(locale: SovereignLocale): TFunction {
  return (key, vars) => translate(key, locale, vars);
}

export { type MessageKey };
