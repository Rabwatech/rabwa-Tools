import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Wrench, 
  FileText, 
  Globe, 
  Calculator, 
  Palette, 
  CheckSquare, 
  FileIcon, 
  Shuffle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Users,
  Search,
  Play,
  Target,
  Sparkles,
  Lock,
  Smartphone,
  Moon,
  Wifi,
  CheckCircle,
  Gift,
  Award,
  Rocket,
  MousePointer,
  Eye,
  Code,
  Zap as Lightning
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { useLanguage } from '@/hooks/use-language';
import Cookies from 'js-cookie';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [counterValue, setCounterValue] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const { t, language } = useLanguage();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
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
  
  // Preloader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);



  // Counter animation
  useEffect(() => {
    if (isLoaded) {
      const timer = setInterval(() => {
        setCounterValue(prev => {
          if (prev < 145) {
            return prev + 1;
          }
          return prev;
        });
      }, 20);
      
      return () => clearInterval(timer);
    }
  }, [isLoaded]);

  // Category rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCategory(prev => (prev + 1) % 7);
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);

  // GSAP animations
  useEffect(() => {
    // Hero animations
    gsap.fromTo('.hero-title', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );
    
    gsap.fromTo('.hero-subtitle', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, delay: 0.3, ease: 'power3.out' }
    );
    
    gsap.fromTo('.hero-cta', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'power3.out' }
    );

    // Floating elements animation
    // gsap.to('.floating-icon', {
    //   y: -20,
    //   duration: 3,
    //   repeat: -1,
    //   yoyo: true,
    //   ease: 'power2.inOut',
    //   stagger: 0.2
    // });

    // Scroll-triggered animations
    gsap.utils.toArray('.animate-on-scroll').forEach((element: any) => {
      gsap.fromTo(element,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Parallax effect for background elements
    // gsap.to('.parallax-bg', {
    //   yPercent: -50,
    //   ease: 'none',
    //   scrollTrigger: {
    //     trigger: '.hero-section',
    //     start: 'top bottom',
    //     end: 'bottom top',
    //     scrub: true
    //   }
    // });

    setIsLoaded(true);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show scroll to top button
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { icon: FileText, name: t('landing.categories.textWriting'), count: 23, color: "#4A638D", description: t('landing.categories.textWritingDesc') },
    { icon: Globe, name: t('landing.categories.conversion'), count: 20, color: "#1ABC9C", description: t('landing.categories.conversionDesc') },
    { icon: Calculator, name: t('landing.categories.financial'), count: 20, color: "#CBA79D", description: t('landing.categories.financialDesc') },
    { icon: Palette, name: t('landing.categories.colorDesign'), count: 21, color: "#D691A4", description: t('landing.categories.colorDesignDesc') },
    { icon: CheckSquare, name: t('landing.categories.productivity'), count: 20, color: "#2C3E50", description: t('landing.categories.productivityDesc') },
    { icon: FileIcon, name: t('landing.categories.fileTools'), count: 21, color: "#4A638D", description: t('landing.categories.fileToolsDesc') },
    { icon: Shuffle, name: t('landing.categories.miscellaneous'), count: 20, color: "#1ABC9C", description: t('landing.categories.miscellaneousDesc') }
  ];

  const features = [
    { icon: Lock, title: t('landing.features.privacyFirst'), description: t('landing.features.privacyFirstDesc'), color: "#4A638D" },
    { icon: Zap, title: t('landing.features.lightningFast'), description: t('landing.features.lightningFastDesc'), color: "#1ABC9C" },
    { icon: Smartphone, title: t('landing.features.universalAccess'), description: t('landing.features.universalAccessDesc'), color: "#CBA79D" },
    { icon: CheckCircle, title: t('landing.features.noRegistration'), description: t('landing.features.noRegistrationDesc'), color: "#D691A4" },
    { icon: Moon, title: t('landing.features.darkLightMode'), description: t('landing.features.darkLightModeDesc'), color: "#2C3E50" },
    { icon: Wifi, title: t('landing.features.offlineReady'), description: t('landing.features.offlineReadyDesc'), color: "#4A638D" }
  ];

  // Magnetic effect for buttons
  const magneticVariants = {
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-muted to-muted/50 dark:from-background dark:via-muted/20 dark:to-muted/10 overflow-hidden">
      {/* Navigation */}
      <Navbar currentPage="home" />
      
      {/* EPIC PRELOADER */}
      {showPreloader && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#4A638D] via-[#1ABC9C] to-[#D691A4] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="w-full flex justify-center items-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img 
                src="/rabwa-logo.png" 
                alt="RABWA Logo" 
                className="w-20 h-20 object-contain filter brightness-0 invert"
              />
            </motion.div>
            <motion.h1
              className="text-4xl font-black text-white mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {t('landing.title')}
            </motion.h1>
            <motion.div
              className="w-64 h-2 bg-white/30 rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.p
              className="text-white/80 mt-4 text-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              {t('landing.loading')}
            </motion.p>
          </div>
        </motion.div>
      )}



      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0, y: 100 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          scale: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 100
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.button
          onClick={scrollToTop}
          className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full shadow-2xl border-2 border-border/20 backdrop-blur-xl flex items-center justify-center text-primary-foreground hover:shadow-primary/25 transition-all duration-300"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="w-6 h-6 rotate-[-90deg]" />
          </motion.div>
        </motion.button>
      </motion.div>





      {/* HERO SECTION - LEGENDARY! */}
      <section ref={heroRef} className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `
          }}
        />
        
        {/* Green background matching grid size */}
        <div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `
              linear-gradient(to right, hsl(var(--secondary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--secondary)) 1px, transparent 1px)
            `
          }}
        />
        
        {/* Gradient Mesh - التدرج اللوني */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-card/20 backdrop-blur-xl border border-border/30 rounded-full text-primary font-semibold mb-8 shadow-xl"
          >
            <Sparkles className="w-5 h-5 text-secondary" />
            {t('landing.badge')}
          </motion.div>

          {/* RABWA Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/30 p-4">
              <img 
                src="/rabwa-logo.png" 
                alt="RABWA Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="hero-title text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight"
            style={{
              textShadow: '0 0 60px hsl(var(--primary) / 0.3)'
            }}
          >
            {t('landing.title')}
          </motion.h1>

          {/* Animated Tagline */}
          <motion.p
            className="hero-subtitle text-xl md:text-2xl text-foreground mb-8 font-medium max-w-4xl mx-auto leading-relaxed"
          >
            {t('landing.subtitle')}{' '}
            <span className="font-bold text-primary">
              {counterValue}+ {t('landing.toolsCount')}
            </span>{' '}
            {t('landing.subtitleEnd')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.a
              href="/tools"
              variants={magneticVariants}
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Button className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground border-0 shadow-xl hover:shadow-primary/25 transition-all duration-300 group rounded-full">
                <Search className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                {t('landing.exploreTools')}
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.a>
            
            <motion.div
              variants={magneticVariants}
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              
            </motion.div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            {[
              { label: t('landing.stats.tools'), value: '180+', icon: Wrench, color: '#4A638D' },
              { label: t('landing.stats.categories'), value: '8', icon: Globe, color: '#1ABC9C' },
              { label: t('landing.stats.free'), value: '100%', icon: Gift, color: '#CBA79D' },
              { label: t('landing.stats.privacy'), value: t('landing.stats.privacy'), icon: Shield, color: '#D691A4' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 shadow-lg border border-white/30">
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>
                <div className="text-2xl font-bold text-[#2C3E50] mb-1">{stat.value}</div>
                <div className="text-sm text-[#2C3E50]/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#4A638D] rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-[#4A638D] rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION - Mind-blowing! */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-center"
            >
              {t('landing.whyChoose')}
            </motion.h2>
            <p className="text-xl text-[#2C3E50] dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing.whyChooseSubtitle')}
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="animate-on-scroll"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: feature.color }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-[#2C3E50] dark:text-white mb-2">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-lg text-[#2C3E50]/80 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS SHOWCASE - Interactive Grid! */}
      <section className="py-32 bg-gradient-to-br from-[#4A638D]/5 to-[#1ABC9C]/5 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] bg-clip-text text-transparent">
              {t('landing.categories.title')}
            </h2>
            <p className="text-xl text-[#2C3E50] dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing.categories.subtitle')}
            </p>
          </motion.div>

          {/* Interactive Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                className="animate-on-scroll"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl"
                      style={{ backgroundColor: category.color }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotateY: 180,
                        boxShadow: `0 25px 50px ${category.color}40`
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <category.icon className="w-12 h-12 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-[#2C3E50] dark:text-white mb-2">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-[#2C3E50]/70 dark:text-gray-300">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge 
                      variant="secondary" 
                      className="text-sm px-4 py-2 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] text-white border-0"
                    >
                      {category.count} {t('common.tools')}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>





      {/* CTA SECTION - Conversion Focused! */}
      <section className="py-32 bg-gradient-to-r from-[#4A638D]/10 via-[#1ABC9C]/10 to-[#D691A4]/10 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] bg-clip-text text-transparent">
              {t('landing.readyToStart')}
            </h2>
            <p className="text-2xl text-[#2C3E50] dark:text-gray-300 mb-12 leading-relaxed">
              {t('landing.readyToStartSubtitle')} <span className="font-bold text-[#4A638D]">500K+ {t('landing.usersCount')}</span> {t('landing.whoTrust')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <motion.a
                href="/tools"
                variants={magneticVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                                 <Button className="text-xl px-12 py-8 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] hover:from-[#1ABC9C] hover:to-[#4A638D] text-white border-0 shadow-2xl hover:shadow-[#4A638D]/25 transition-all duration-300 group rounded-full">
                   <Rocket className="w-7 h-7 mr-3 group-hover:rotate-12 transition-transform" />
                   {t('landing.startUsingTools')}
                   <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform" />
                 </Button>
              </motion.a>
              
              <motion.div
                variants={magneticVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                                 
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { icon: Star, label: t('landing.trustIndicators.rating'), color: '#FFD700' },
                { icon: Users, label: t('landing.trustIndicators.users'), color: '#4A638D' },
                { icon: Shield, label: t('landing.trustIndicators.secure'), color: '#1ABC9C' },
                { icon: Award, label: t('landing.trustIndicators.bestTools'), color: '#D691A4' }
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  <span className="text-lg font-semibold text-[#2C3E50]">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
