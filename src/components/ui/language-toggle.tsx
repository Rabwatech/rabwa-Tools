import React, { useEffect } from 'react';
import { Button } from './button';
import { useLanguage } from '@/hooks/use-language';
import { Languages } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
  };

  const displayText = language === 'ar' ? 'العربية' : 'English';
  const buttonTitle = t('common.language') || 'Language';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`gap-2 font-semibold transition-all duration-300 hover:scale-105 min-w-[120px] relative overflow-hidden ${
        language === 'ar' 
          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 hover:border-green-400 hover:bg-green-100/50' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-100/50'
      }`}
      title={buttonTitle}
    >
      {/* Language Indicator */}
      <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
        language === 'ar' ? 'bg-green-500' : 'bg-blue-500'
      }`} />
      
      <Languages className={`w-4 h-4 ${
        language === 'ar' ? 'text-green-600' : 'text-blue-600'
      }`} />
      
      <span className="hidden sm:inline font-medium">
        {displayText}
      </span>
      <span className="sm:hidden text-xs font-bold">
        {language === 'ar' ? 'ع' : 'EN'}
      </span>
    </Button>
  );
};
