import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart, 
  Sparkles,
  Globe,
  Shield,
  Zap,
  Users,
  Star
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "All Tools", href: "/tools" },
        { name: "Categories", href: "/#categories" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Updates", href: "/#updates" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/#about" },
        { name: "Careers", href: "/#careers" },
        { name: "Press", href: "/#press" },
        { name: "Partners", href: "/#partners" },
        { name: "Contact", href: "/#contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "API Reference", href: "/api" },
        { name: "Tutorials", href: "/tutorials" },
        { name: "Blog", href: "/blog" },
        { name: "Support", href: "/support" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" },
        { name: "Security", href: "/security" }
      ]
    }
  ];

  const features = [
    { icon: Shield, text: "Privacy First", color: "text-blue-500" },
    { icon: Zap, text: "Lightning Fast", color: "text-yellow-500" },
    { icon: Users, text: "Community Driven", color: "text-green-500" },
    { icon: Star, text: "Premium Quality", color: "text-purple-500" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-background via-muted/20 to-muted/50 dark:from-background dark:via-muted/10 dark:to-muted/20 border-t border-border/30 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-secondary rounded-full"
          animate={{
            y: [0, 30, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-1 h-1 bg-accent rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img 
                    src="/rabwa-logo.png" 
                    alt="RABWA Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    RABWA Tools
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Professional Tools Collection
                  </p>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Your ultimate toolkit with professional tools for developers, designers, and everyday users. 
                Built with cutting-edge technology and user experience in mind.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-card/50 backdrop-blur-sm rounded-full border border-border/30"
                  >
                    <feature.icon className={`w-3 h-3 ${feature.color}`} />
                    <span className="text-xs text-muted-foreground font-medium">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/30 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-muted-foreground text-sm"
            >
              <span>© {currentYear} <a href="https://www.rabwatech.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors duration-300">Rabwatech</a>. All rights reserved.</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};
