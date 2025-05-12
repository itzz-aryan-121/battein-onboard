'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locales, LocaleKey } from '../locales';

// Define the context type
type LanguageContextType = {
  language: LocaleKey;
  setLanguage: (lang: LocaleKey) => void;
  t: (section: string, key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
  t: () => '',
});

// Create a hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// The provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LocaleKey>('english');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get the user's preferred language from localStorage
    const userLang = localStorage.getItem('preferredLanguage') as LocaleKey;
    if (userLang && Object.keys(locales).includes(userLang)) {
      setLanguage(userLang);
    }
    setIsLoaded(true);
  }, []);

  const changeLanguage = (lang: LocaleKey) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  // Translation function
  const t = (section: string, key: string): string => {
    if (!isLoaded) return '';
    
    try {
      // @ts-ignore
      return locales[language][section][key] || `${section}.${key}`;
    } catch (error) {
      console.error(`Translation not found for ${section}.${key} in ${language} locale`);
      return `${section}.${key}`;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {isLoaded ? children : null}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 