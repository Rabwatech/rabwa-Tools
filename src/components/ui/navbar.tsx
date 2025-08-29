import React, { useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Wrench, Menu, X } from 'lucide-react';
import { Button } from './button';
import { ThemeToggle } from './theme-toggle';

interface NavbarProps {
  currentPage?: 'home' | 'tools' | 'features' | 'about';
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const navigationItems = [
    { name: 'Home', href: '/', page: 'home' },
    { name: 'Features', href: '/features', page: 'features' },
    { name: 'Tools', href: '/tools', page: 'tools' },
    { name: 'About', href: '/#about', page: 'about' }
  ];

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
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
              <img 
                src="/rabwa-logo-new.png" 
                alt="RABWA Logo" 
                className="w-6 h-6 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                RABWA Tools
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Professional Tools Collection
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                RABWA Tools
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-10">
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

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Brand New */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-border/30">
            <div className="bg-card rounded-lg shadow-lg p-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                    currentPage === item.page 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};
