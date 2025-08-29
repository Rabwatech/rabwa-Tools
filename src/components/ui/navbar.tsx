import React, { useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { Button } from './button';
import { ThemeToggle } from './theme-toggle';

interface NavbarProps {
  currentPage?: 'home' | 'tools' | 'features' | 'about';
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const { scrollYProgress } = useScroll();

  const navigationItems = [
    { name: 'Home', href: '/', page: 'home' },
    { name: 'Features', href: '/#features', page: 'features' },
    { name: 'Tools', href: '/tools', page: 'tools' },
    { name: 'About', href: '/#about', page: 'about' }
  ];

  const getButtonText = () => {
    switch (currentPage) {
      case 'tools':
        return 'Back to Home';
      case 'features':
        return 'Explore Tools';
      case 'about':
        return 'Get Started';
      default:
        return 'Get Started';
    }
  };

  const getButtonHref = () => {
    switch (currentPage) {
      case 'tools':
        return '/';
      case 'features':
        return '/tools';
      case 'about':
        return '/tools';
      default:
        return '/tools';
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 dark:bg-background/90 backdrop-blur-2xl border-b border-border/30 shadow-2xl"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      </div>
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Animated Logo */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring" as const, stiffness: 400 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-2xl border border-border/20"
              animate={{ 
                rotate: 360,
                boxShadow: [
                  "0 0 20px hsl(var(--primary) / 0.3)",
                  "0 0 40px hsl(var(--secondary) / 0.4)",
                  "0 0 20px hsl(var(--primary) / 0.3)"
                ]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Wrench className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                RabwaTools
              </h1>
              <p className="text-sm font-semibold text-muted-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Professional Tools Collection
              </p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-10">
            {navigationItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`font-semibold transition-all duration-300 relative group text-lg ${
                  currentPage === item.page 
                    ? 'text-primary' 
                    : 'text-foreground hover:text-primary'
                }`}
                whileHover={{ y: -3, scale: 1.05 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </motion.a>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <a href={getButtonHref()}>
              <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-accent hover:via-secondary hover:to-primary text-primary-foreground border-0 shadow-2xl hover:shadow-primary/30 transition-all duration-500 rounded-full px-8 py-3 text-lg font-semibold">
                <Wrench className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                {getButtonText()}
                <motion.div
                  className="ml-2 w-2 h-2 bg-primary-foreground rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};
