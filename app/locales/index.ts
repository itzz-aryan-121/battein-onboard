// Import all locale files
import en from './en';
import hi from './hi';

// Export the locales
export const locales = {
  english: en,
  hindi: hi
};

export type LocaleKey = keyof typeof locales; 