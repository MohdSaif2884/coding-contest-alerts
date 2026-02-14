import { ArrowRight, Bell, Clock, MessageSquare, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Dark circuit board background */}
      <div className="absolute inset-0 bg-circuit opacity-40" />
      
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />

      {/* Circuit line decorations */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="60%" y1="0" x2="60%" y2="100%" stroke="hsl(252 87% 65% / 0.3)" strokeWidth="1" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="hsl(252 87% 65% / 0.2)" strokeWidth="1" />
        <line x1="85%" y1="20%" x2="100%" y2="20%" stroke="hsl(252 87% 65% / 0.3)" strokeWidth="1" />
        <line x1="55%" y1="60%" x2="100%" y2="60%" stroke="hsl(252 87% 65% / 0.2)" strokeWidth="1" />
        <line x1="70%" y1="30%" x2="70%" y2="70%" stroke="hsl(252 87% 65% / 0.15)" strokeWidth="1" />
        <circle cx="60%" cy="40%" r="3" fill="hsl(252 87% 65% / 0.4)" />
        <circle cx="75%" cy="60%" r="3" fill="hsl(252 87% 65% / 0.3)" />
        <circle cx="85%" cy="20%" r="3" fill="hsl(252 87% 65% / 0.4)" />
      </svg>

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-display-lg lg:text-display-xl font-bold mb-6 leading-tight"
            >
              Never Miss a{" "}
              <br />
              <span className="text-gradient">Coding Contest</span>
              {" "}Again
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg"
            >
              The smart reminder service for your interest online coding contest
              rounds can keep your, platforms how things coding the dreams
              contest again or by AlgoBell.
            </motion.p>

            {/* Pill Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                30 min before
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                WhatsApp & Email
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground">
                <Layers className="w-4 h-4" />
                5 Platforms
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-glow-accent text-primary-foreground btn-shine px-8 text-base rounded-full">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="text-base px-8 rounded-full border-border">
                  See How It Works
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Right: Glowing Bell */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 -m-8 rounded-full bg-primary/10 blur-3xl animate-pulse" />
              
              {/* Bell container */}
              <div className="relative w-64 h-64 xl:w-80 xl:h-80 rounded-full border border-primary/30 flex items-center justify-center">
                {/* Inner glow ring */}
                <div className="absolute inset-4 rounded-full border border-primary/20" />
                <div className="absolute inset-8 rounded-full border border-primary/10" />
                
                {/* Center glow */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-xl" />
                
                {/* Bell Icon */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bell className="w-20 h-20 xl:w-24 xl:h-24 text-primary drop-shadow-[0_0_30px_hsl(252_87%_65%_/_0.5)]" />
                </motion.div>
              </div>

              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-2 h-2 rounded-full bg-primary/60" />
              <div className="absolute -bottom-2 -left-6 w-1.5 h-1.5 rounded-full bg-primary/40" />
              <div className="absolute top-1/2 -right-10 w-1 h-1 rounded-full bg-primary/50" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom right star decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 text-primary/20 text-4xl pointer-events-none"
      >
        ✦
      </motion.div>
    </section>
  );
}
