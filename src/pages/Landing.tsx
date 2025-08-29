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
  TrendingUp,
  Search,
  Play,
  Target,
  Sparkles,
  Lock,
  Smartphone,
  Moon,
  Wifi,
  CheckCircle,
  Globe2,
  Heart,
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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [counterValue, setCounterValue] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
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
    gsap.to('.floating-icon', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
      stagger: 0.2
    });

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
    gsap.to('.parallax-bg', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

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
    { icon: FileText, name: "Text & Writing", count: 23, color: "#4A638D", description: "Text processing & analysis" },
    { icon: Globe, name: "Conversion", count: 20, color: "#1ABC9C", description: "Unit & format conversion" },
    { icon: Calculator, name: "Financial", count: 20, color: "#CBA79D", description: "Business calculations" },
    { icon: Palette, name: "Color & Design", count: 21, color: "#D691A4", description: "Creative tools" },
    { icon: CheckSquare, name: "Productivity", count: 20, color: "#2C3E50", description: "Time management" },
    { icon: FileIcon, name: "File Tools", count: 21, color: "#4A638D", description: "File processing" },
    { icon: Shuffle, name: "Miscellaneous", count: 20, color: "#1ABC9C", description: "Utility tools" }
  ];

  const features = [
    { icon: Lock, title: "Privacy First", description: "Data never leaves your browser", color: "#4A638D" },
    { icon: Zap, title: "Lightning Fast", description: "Instant processing, zero delays", color: "#1ABC9C" },
    { icon: Smartphone, title: "Universal Access", description: "Works on any device, anywhere", color: "#CBA79D" },
    { icon: CheckCircle, title: "No Registration", description: "Start using immediately", color: "#D691A4" },
    { icon: Moon, title: "Dark/Light Mode", description: "Beautiful themes", color: "#2C3E50" },
    { icon: Wifi, title: "Offline Ready", description: "Works without internet", color: "#4A638D" }
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-[#E9ECEF] to-[#DEE2E6] overflow-hidden">
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
              className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-white/30"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 rgba(74, 99, 141, 0.4)",
                  "0 0 20px rgba(74, 99, 141, 0.6)",
                  "0 0 0 rgba(74, 99, 141, 0.4)"
                ]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Wrench className="w-16 h-16 text-white" />
            </motion.div>
            <motion.h1
              className="text-4xl font-black text-white mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              RabwaTools
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
              Loading legendary experience...
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
          className="w-16 h-16 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:shadow-[#4A638D]/25 transition-all duration-300"
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
          className="absolute inset-0 opacity-20"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `
              linear-gradient(to right, #4A638D 1px, transparent 1px),
              linear-gradient(to bottom, #4A638D 1px, transparent 1px)
            `
          }}
        />
        
        {/* Green background matching grid size */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `
              linear-gradient(to right, #1ABC9C 1px, transparent 1px),
              linear-gradient(to bottom, #1ABC9C 1px, transparent 1px)
            `
          }}
        />
        
        {/* Gradient Mesh - التدرج اللوني */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A638D]/10 via-[#1ABC9C]/10 to-[#D691A4]/10" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-[#4A638D] font-semibold mb-12 shadow-2xl"
          >
            <Sparkles className="w-6 h-6 text-[#1ABC9C]" />
            Professional Tools Collection
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="hero-title text-7xl md:text-9xl font-black mb-12 bg-gradient-to-r from-[#4A638D] via-[#1ABC9C] to-[#D691A4] bg-clip-text text-transparent leading-tight"
            style={{
              textShadow: '0 0 80px rgba(74, 99, 141, 0.3)'
            }}
          >
            RabwaTools
          </motion.h1>

          {/* Animated Tagline */}
          <motion.p
            className="hero-subtitle text-3xl md:text-4xl text-[#2C3E50] mb-12 font-medium max-w-5xl mx-auto leading-relaxed"
          >
            Your ultimate toolkit with{' '}
            <span className="font-bold text-[#4A638D]">
              {counterValue}+ professional tools
            </span>{' '}
            for developers, designers, and everyday users.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta flex flex-col sm:flex-row gap-8 justify-center mb-20"
          >
            <motion.a
              href="/tools"
              variants={magneticVariants}
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Button className="text-2xl px-12 py-8 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] hover:from-[#1ABC9C] hover:to-[#4A638D] text-white border-0 shadow-2xl hover:shadow-[#4A638D]/25 transition-all duration-300 group rounded-full">
                <Search className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" />
                Explore All Tools
                <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.a>
            
            <motion.div
              variants={magneticVariants}
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Button variant="outline" className="text-2xl px-12 py-8 border-2 border-[#CBA79D] text-[#2C3E50] hover:bg-[#CBA79D] hover:text-white shadow-xl hover:shadow-[#CBA79D]/25 transition-all duration-300 rounded-full">
                <Play className="w-7 h-7 mr-4" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-12 text-center"
          >
            {[
              { label: 'Tools', value: '180+', icon: Wrench, color: '#4A638D' },
              { label: 'Categories', value: '8', icon: Globe, color: '#1ABC9C' },
              { label: 'Free', value: '100%', icon: Gift, color: '#CBA79D' },
              { label: 'Privacy', value: 'First', icon: Shield, color: '#D691A4' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 shadow-lg border border-white/30">
                  <stat.icon className="w-10 h-10" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold text-[#2C3E50] mb-2">{stat.value}</div>
                <div className="text-base text-[#2C3E50]/70 font-medium">{stat.label}</div>
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
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] bg-clip-text text-transparent">
              Why Choose RabwaTools?
            </h2>
            <p className="text-xl text-[#2C3E50] max-w-3xl mx-auto">
              Built with cutting-edge technology and user experience in mind
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
                <Card className="group h-full bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: feature.color }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-[#2C3E50] mb-2">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-lg text-[#2C3E50]/80 leading-relaxed">
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
              Explore Tool Categories
            </h2>
            <p className="text-xl text-[#2C3E50] max-w-3xl mx-auto">
              Organized into logical categories for easy discovery
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
                <Card className="group h-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden">
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
                    <CardTitle className="text-xl font-bold text-[#2C3E50] mb-2">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-[#2C3E50]/70">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge 
                      variant="secondary" 
                      className="text-sm px-4 py-2 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] text-white border-0"
                    >
                      {category.count} tools
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - Social Proof! */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] bg-clip-text text-transparent">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-[#2C3E50] max-w-3xl mx-auto">
              Join thousands of satisfied users who trust RabwaTools
            </p>
          </motion.div>

          {/* Animated Counter */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-[#4A638D]/10 to-[#1ABC9C]/10 rounded-2xl border border-white/20 backdrop-blur-xl">
              <Globe2 className="w-12 h-12 text-[#1ABC9C]" />
              <div className="text-left">
                <div className="text-4xl font-bold text-[#2C3E50]">1M+</div>
                <div className="text-lg text-[#2C3E50]/70">Tools used daily</div>
              </div>
            </div>
          </motion.div>

          {/* Floating Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Chen",
                role: "Frontend Developer",
                company: "TechCorp",
                avatar: "👩‍💻",
                content: "RabwaTools has become my go-to for quick calculations and conversions. The interface is beautiful and everything works instantly!",
                rating: 5
              },
              {
                name: "Ahmed Hassan",
                role: "UI/UX Designer",
                company: "DesignStudio",
                avatar: "👨‍🎨",
                content: "The color tools are incredible! I use them daily for creating perfect color schemes. This is exactly what I needed.",
                rating: 5
              },
              {
                name: "Maria Rodriguez",
                role: "Product Manager",
                company: "StartupXYZ",
                avatar: "👩‍💼",
                content: "As a PM, I need quick access to various tools. RabwaTools provides everything in one place. Game changer!",
                rating: 5
              }
            ].map((review, index) => (
              <motion.div
                key={review.name}
                className="animate-on-scroll"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(74, 99, 141, 0.3)"
                }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{review.avatar}</div>
                      <div>
                        <CardTitle className="text-lg text-[#2C3E50]">{review.name}</CardTitle>
                        <CardDescription className="text-[#2C3E50]/70">
                          {review.role} at {review.company}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#2C3E50]/80 leading-relaxed italic">
                      "{review.content}"
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING/VALUE SECTION - Show the Value! */}
      <section className="py-32 bg-gradient-to-br from-[#CBA79D]/10 to-[#D691A4]/10 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-[#4A638D] to-[#1ABC9C] bg-clip-text text-transparent">
              Why Pay When You Can Get It Free?
            </h2>
            <p className="text-2xl text-[#2C3E50] mb-16 leading-relaxed">
              Compare RabwaTools with other premium tool websites
            </p>

            {/* Comparison Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "Other Tool Sites",
                  price: "$29/month",
                  features: ["Limited tools", "Ads everywhere", "Data collection", "Slow performance", "Registration required"],
                  color: "from-red-500 to-red-600"
                },
                {
                  name: "RabwaTools",
                  price: "FREE",
                  features: ["180+ tools", "Zero ads", "100% private", "Lightning fast", "No registration"],
                  color: "from-[#4A638D] to-[#1ABC9C]",
                  featured: true
                },
                {
                  name: "Premium Alternatives",
                  price: "$99/month",
                  features: ["Complex tools", "Steep learning curve", "Enterprise focused", "Overkill for most", "Expensive"],
                  color: "from-purple-500 to-purple-600"
                }
              ].map((plan, index) => (
                <motion.div
                  key={plan.name}
                  className="animate-on-scroll"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full relative overflow-hidden ${plan.featured ? 'scale-105 ring-4 ring-[#1ABC9C]/30' : ''}`}>
                    {plan.featured && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-[#1ABC9C] to-[#4A638D] text-white border-0 px-6 py-2 text-lg">
                          🏆 RECOMMENDED
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-6">
                      <CardTitle className={`text-2xl font-bold mb-4 ${plan.featured ? 'text-[#4A638D]' : 'text-[#2C3E50]'}`}>
                        {plan.name}
                      </CardTitle>
                      <div className={`text-4xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                        {plan.price}
                      </div>
                    </CardHeader>
                    <CardContent className="text-left">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.featured ? 'bg-[#1ABC9C]' : 'bg-gray-300'}`}>
                              {plan.featured ? (
                                <CheckCircle className="w-3 h-3 text-white" />
                              ) : (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className={`text-sm ${plan.featured ? 'text-[#2C3E50] font-medium' : 'text-[#2C3E50]/70'}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Value Proposition */}
            <motion.div
              className="bg-gradient-to-r from-[#4A638D]/10 to-[#1ABC9C]/10 rounded-2xl p-8 border border-white/20 backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-[#2C3E50] mb-4">
                💰 Save $348+ per year with RabwaTools!
              </h3>
              <p className="text-xl text-[#2C3E50]/80 mb-6">
                Get premium-quality tools without the premium price tag
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-center">
                {[
                  { label: 'Monthly Savings', value: '$29', icon: Gift },
                  { label: 'Yearly Savings', value: '$348', icon: TrendingUp },
                  { label: 'Lifetime Value', value: 'Priceless', icon: Heart }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <item.icon className="w-8 h-8 text-[#1ABC9C] mb-2" />
                    <div className="text-2xl font-bold text-[#4A638D]">{item.value}</div>
                    <div className="text-sm text-[#2C3E50]/70">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
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
              Ready to Get Started?
            </h2>
            <p className="text-2xl text-[#2C3E50] mb-12 leading-relaxed">
              Join <span className="font-bold text-[#4A638D]">500K+ users</span> who trust RabwaTools for their daily needs
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
                   Start Using Tools
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
                                 <Button variant="outline" className="text-xl px-12 py-8 border-2 border-[#CBA79D] text-[#2C3E50] hover:bg-[#CBA79D] hover:text-white shadow-xl hover:shadow-[#CBA79D]/25 transition-all duration-300 rounded-full">
                   <Users className="w-7 h-7 mr-3" />
                   Join Community
                 </Button>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { icon: Star, label: '4.9/5 Rating', color: '#FFD700' },
                { icon: Users, label: '500K+ Users', color: '#4A638D' },
                { icon: Shield, label: '100% Secure', color: '#1ABC9C' },
                { icon: Award, label: 'Best Tools 2024', color: '#D691A4' }
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
      <footer className="py-16 bg-gradient-to-r from-[#2C3E50] to-[#4A638D] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#1ABC9C] to-[#D691A4] rounded-xl flex items-center justify-center shadow-lg">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold">RabwaTools</span>
          </motion.div>
          
          <motion.p
            className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Professional tools for everyone. Built with ❤️ for the community.
          </motion.p>
          
          <motion.div
            className="flex items-center justify-center gap-8 text-sm text-white/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span>© 2024 RabwaTools</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Contact Us</span>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
