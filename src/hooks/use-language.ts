import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { translations, Language } from '@/locales';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
};

// Custom storage for cookies
const cookieStorage = {
  getItem: (name: string) => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string) => {
    // Set cookie to expire in 1 year (365 days)
    Cookies.set(name, value, { expires: 365, secure: true, sameSite: 'strict' });
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  }
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: (() => {
        // Try to get language from cookies first
        const cookieLang = Cookies.get('rabwa-language');
        if (cookieLang && (cookieLang === 'ar' || cookieLang === 'en')) {
          return cookieLang as Language;
        }
        
        // Fallback to localStorage backup
        const localLang = localStorage.getItem('rabwa-language-backup');
        if (localLang && (localLang === 'ar' || localLang === 'en')) {
          return localLang as Language;
        }
        
        // Default to English
        return 'en' as Language;
      })(),
      
      setLanguage: (language: Language) => {
        // Update state first to trigger re-renders
        set({ language });
        
        // Update document attributes immediately
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
        document.body.style.direction = dir;
        document.body.classList.add('language-change');
        
        // Add language transition class to body
        document.body.classList.add('language-transition');
        
        // Remove animation class after transition
        setTimeout(() => {
          document.body.classList.remove('language-change');
        }, 100);
        
        // Save to cookies (primary storage)
        Cookies.set('rabwa-language', language, { 
          expires: 365, // 1 year
          secure: true, 
          sameSite: 'strict' 
        });
        
        // Also save to localStorage as backup
        localStorage.setItem('rabwa-language-backup', language);
      },
      
      t: (key: string) => {
        const { language } = get();
        const translation = translations[language];
        const result = getNestedValue(translation, key);
        return result || key; // Fallback to key if translation not found
      },
      
      get dir() {
        return get().language === 'ar' ? 'rtl' : 'ltr';
      }
    }),
    {
      name: 'rabwa-language-cookies',
      storage: createJSONStorage(() => cookieStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            // Set initial document direction after rehydration
            const dir = state.language === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.dir = dir;
            document.documentElement.lang = state.language;
            document.body.style.direction = dir;
            document.body.classList.add('language-transition');
          }
        };
      }
    }
  )
);
