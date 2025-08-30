import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import Cookies from 'js-cookie';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const languageStore = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check cookies first, then localStorage backup
    let savedLanguage = Cookies.get('rabwa-language');
    
    if (!savedLanguage) {
      // Fallback to localStorage backup
      savedLanguage = localStorage.getItem('rabwa-language-backup');
    }
    
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      const lang = savedLanguage;
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
      document.body.style.direction = dir;
    }
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <LanguageContext.Provider value={languageStore}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within LanguageProvider');
  }
  return context;
};
