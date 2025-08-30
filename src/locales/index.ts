import { ar } from './ar';
import { en } from './en';

export const translations = {
  ar,
  en
};

export type Language = keyof typeof translations;
export type TranslationKeys = keyof typeof ar;
