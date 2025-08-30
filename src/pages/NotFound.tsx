import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { useLanguage } from "@/hooks/use-language";
import Cookies from 'js-cookie';

const NotFound = () => {
  const location = useLocation();
  const { t, language } = useLanguage();

  // Sync language with cookies on page load
  useEffect(() => {
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

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage="home" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
          <p className="text-xl text-muted-foreground mb-4">{t('messages.notFound')}</p>
          <a href="/" className="text-primary hover:text-primary/80 underline">
            {t('nav.home')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
