import React, { useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { Button } from './button';

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
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-2xl border-b border-white/30 shadow-2xl"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A638D] via-[#1ABC9C] to-[#D691A4]"></div>
      </div>
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A638D] via-[#1ABC9C] to-[#D691A4] origin-left"
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
              className="w-14 h-14 bg-gradient-to-br from-[#4A638D] via-[#1ABC9C] to-[#D691A4] rounded-2xl flex items-center justify-center shadow-2xl border border-white/20"
              animate={{ 
                rotate: 360,
                boxShadow: [
                  "0 0 20px rgba(74, 99, 141, 0.3)",
                  "0 0 40px rgba(26, 188, 156, 0.4)",
                  "0 0 20px rgba(74, 99, 141, 0.3)"
                ]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Wrench className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-[#4A638D] via-[#1ABC9C] to-[#D691A4] bg-clip-text text-transparent">
                RabwaTools
              </h1>
              <p className="text-sm font-semibold text-[#2C3E50] bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] bg-clip-text text-transparent">
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
                    ? 'text-[#4A638D]' 
                    : 'text-[#2C3E50] hover:text-[#4A638D]'
                }`}
                whileHover={{ y: -3, scale: 1.05 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#4A638D] via-[#1ABC9C] to-[#D691A4] rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <a href={getButtonHref()}>
              <Button className="bg-gradient-to-r from-[#4A638D] via-[#1ABC9C] to-[#D691A4] hover:from-[#D691A4] hover:via-[#1ABC9C] hover:to-[#4A638D] text-white border-0 shadow-2xl hover:shadow-[#4A638D]/30 transition-all duration-500 rounded-full px-8 py-3 text-lg font-semibold">
                <Wrench className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                {getButtonText()}
                <motion.div
                  className="ml-2 w-2 h-2 bg-white rounded-full"
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
