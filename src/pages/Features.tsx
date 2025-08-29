import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { 
  Zap, Shield, Smartphone, CheckCircle, Moon, Wifi, 
  Star, Users, TrendingUp, Award, Rocket, Globe,
  Lock, Eye, Target, Heart, Sparkles, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

const Features = () => {
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const features = [
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data never leaves your browser. All processing happens locally, ensuring complete privacy and security.",
      color: "#4A638D",
      benefits: ["No data collection", "Local processing", "End-to-end encryption", "GDPR compliant"]
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant processing with zero delays. Optimized algorithms ensure tools respond in milliseconds.",
      color: "#1ABC9C",
      benefits: ["Instant results", "Optimized algorithms", "No server delays", "Real-time processing"]
    },
    {
      icon: Smartphone,
      title: "Universal Access",
      description: "Works seamlessly on any device, anywhere. Responsive design adapts to all screen sizes.",
      color: "#CBA79D",
      benefits: ["Mobile optimized", "Cross-platform", "Offline capable", "Touch friendly"]
    },
    {
      icon: CheckCircle,
      title: "No Registration",
      description: "Start using immediately without any sign-up process. No accounts, no passwords, no hassle.",
      color: "#D691A4",
      benefits: ["Instant access", "No accounts needed", "No email required", "Zero friction"]
    },
    {
      icon: Moon,
      title: "Dark/Light Mode",
      description: "Beautiful themes that adapt to your preference. Switch between modes for optimal viewing experience.",
      color: "#2C3E50",
      benefits: ["Auto-detection", "Custom themes", "Eye comfort", "Modern design"]
    },
    {
      icon: Wifi,
      title: "Offline Ready",
      description: "Core functionality works without internet connection. Perfect for travel or low-connectivity areas.",
      color: "#4A638D",
      benefits: ["Offline tools", "Progressive web app", "Service workers", "Local storage"]
    }
  ];

  const stats = [
    { label: 'Tools Available', value: '145+', icon: Rocket, color: '#4A638D' },
    { label: 'Daily Users', value: '50K+', icon: Users, color: '#1ABC9C' },
    { label: 'Countries', value: '180+', icon: Globe, color: '#CBA79D' },
    { label: 'Uptime', value: '99.9%', icon: CheckCircle, color: '#D691A4' }
  ];

  const technologies = [
    { name: 'React 18', description: 'Latest React with concurrent features', icon: '⚛️' },
    { name: 'TypeScript', description: 'Type-safe development experience', icon: '🔷' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework', icon: '🎨' },
    { name: 'Framer Motion', description: 'Production-ready motion library', icon: '🎭' },
    { name: 'Next.js 14', description: 'Full-stack React framework', icon: '⚡' },
    { name: 'Prisma', description: 'Modern database toolkit', icon: '🗄️' }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-muted to-muted/50 dark:from-background dark:via-muted/20 dark:to-muted/10 overflow-hidden">
      {/* Navigation */}
      <Navbar currentPage="features" />
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundSize: '40px 40px',
              backgroundImage: `
                linear-gradient(to right, #4A638D 1px, transparent 1px),
                linear-gradient(to bottom, #4A638D 1px, transparent 1px)
              `
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A638D]/10 via-[#1ABC9C]/10 to-[#D691A4]/10" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-card/20 backdrop-blur-xl border border-border/30 rounded-full text-primary font-semibold mb-8 shadow-2xl"
          >
            <Sparkles className="w-6 h-6 text-secondary" />
            Why Choose RABWA Tools?
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
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight"
          >
            Built for Excellence
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl md:text-3xl text-foreground mb-12 font-medium max-w-4xl mx-auto leading-relaxed"
          >
            Experience the power of cutting-edge technology combined with thoughtful design. 
            Every feature is crafted to make your workflow faster, safer, and more enjoyable.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a href="/tools">
              <Button className="text-xl px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground border-0 shadow-2xl hover:shadow-primary/25 transition-all duration-300 group rounded-full">
                <Rocket className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Explore All Tools
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Core Features
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Discover what makes RABWA Tools the ultimate choice for professionals and enthusiasts
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="group h-full bg-card/60 dark:bg-card/80 backdrop-blur-xl border border-border/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden feature-card">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: feature.color }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {feature.description}
                    </CardDescription>
                    
                    {/* Benefits List */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-32 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Trusted by Millions
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Join a global community of satisfied users who trust RABWA Tools
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center stats-card p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-20 h-20 bg-card/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 shadow-lg border border-border/30 mx-auto">
                  <stat.icon className="w-10 h-10" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-base text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY STACK */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Built with Modern Tech
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Leveraging the latest technologies for optimal performance and developer experience
            </p>
          </motion.div>

          {/* Tech Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full bg-card/70 dark:bg-card/80 backdrop-blur-xl border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-500 tech-card">
                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-4">{tech.icon}</div>
                    <CardTitle className="text-xl font-bold text-foreground mb-2">
                      {tech.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-muted-foreground">
                      {tech.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to Experience Excellence?
            </h2>
            <p className="text-2xl text-foreground mb-12 leading-relaxed">
              Join thousands of users who have already discovered the power of RABWA Tools
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                href="/tools"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="text-xl px-12 py-8 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground border-0 shadow-2xl hover:shadow-primary/25 transition-all duration-300 group rounded-full">
                  <Rocket className="w-7 h-7 mr-3 group-hover:rotate-12 transition-transform" />
                  Start Using Tools
                  <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.a>
              
              <motion.a
                href="/"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="text-xl px-12 py-8 border-2 border-accent text-foreground hover:bg-accent hover:text-accent-foreground shadow-xl hover:shadow-accent/25 transition-all duration-300 rounded-full">
                  <Heart className="w-7 h-7 mr-3" />
                  Learn More
                </Button>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Features;
