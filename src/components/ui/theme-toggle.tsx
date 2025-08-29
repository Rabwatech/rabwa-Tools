import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '../providers/theme-provider';

export const ThemeToggle: React.FC = () => {
  const { theme, mounted, toggleTheme, isDark } = useTheme();

  // تجنب التصيير حتى يتم تحميل المكون
  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Button
        onClick={toggleTheme}
        variant="ghost"
        size="icon"
        className="relative w-12 h-12 rounded-full bg-card/50 hover:bg-card/80 border border-border/50 hover:border-border transition-all duration-300 group overflow-hidden"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* خلفية متدرجة متحركة */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* أيقونة الشمس */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            rotate: isDark ? 0 : 180,
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          <Sun className="w-5 h-5 text-warning" />
        </motion.div>
        
        {/* أيقونة القمر */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            rotate: isDark ? -180 : 0,
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          <Moon className="w-5 h-5 text-primary" />
        </motion.div>
        
        {/* تأثير التوهج */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isDark 
              ? "0 0 20px rgba(74, 99, 141, 0.3)" 
              : "0 0 20px rgba(255, 193, 7, 0.3)"
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        />
      </Button>
    </motion.div>
  );
};

// مكون إضافي لاختيار الوضع يدوياً
export const ThemeSelector: React.FC = () => {
  const { theme, setLightTheme, setDarkTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg border border-border">
      <Button
        onClick={setLightTheme}
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 px-3 text-xs"
      >
        <Sun className="w-3 h-3 mr-1" />
        فاتح
      </Button>
      
      <Button
        onClick={setDarkTheme}
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 px-3 text-xs"
      >
        <Moon className="w-3 h-3 mr-1" />
        مظلم
      </Button>
    </div>
  );
};
