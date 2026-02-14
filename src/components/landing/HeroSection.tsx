import { ArrowRight, Bell, Clock, MessageSquare, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Circuit board SVG background that radiates from center-right
function CircuitBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="circuitGlow" cx="70%" cy="50%" r="50%" fx="70%" fy="50%">
          <stop offset="0%" stopColor="hsl(217 91% 60% / 0.12)" />
          <stop offset="40%" stopColor="hsl(217 91% 60% / 0.04)" />
          <stop offset="100%" stopColor="hsl(217 91% 60% / 0)" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowStrong">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Radial glow behind bell area */}
      <rect width="100%" height="100%" fill="url(#circuitGlow)" />

      {/* === VERTICAL LINES radiating from right side === */}
      {/* Main vertical lines */}
      <line x1="55%" y1="0" x2="55%" y2="100%" stroke="hsl(217 91% 60% / 0.08)" strokeWidth="1" />
      <line x1="62%" y1="0" x2="62%" y2="100%" stroke="hsl(217 91% 60% / 0.12)" strokeWidth="1" filter="url(#glow)" />
      <line x1="68%" y1="0" x2="68%" y2="100%" stroke="hsl(217 91% 60% / 0.15)" strokeWidth="1" filter="url(#glow)" />
      <line x1="73%" y1="0" x2="73%" y2="100%" stroke="hsl(217 91% 60% / 0.1)" strokeWidth="1" />
      <line x1="78%" y1="0" x2="78%" y2="100%" stroke="hsl(217 91% 60% / 0.18)" strokeWidth="1" filter="url(#glow)" />
      <line x1="83%" y1="0" x2="83%" y2="100%" stroke="hsl(217 91% 60% / 0.12)" strokeWidth="1" filter="url(#glow)" />
      <line x1="88%" y1="0" x2="88%" y2="100%" stroke="hsl(217 91% 60% / 0.08)" strokeWidth="1" />
      <line x1="93%" y1="0" x2="93%" y2="100%" stroke="hsl(217 91% 60% / 0.15)" strokeWidth="1" filter="url(#glow)" />
      <line x1="97%" y1="0" x2="97%" y2="100%" stroke="hsl(217 91% 60% / 0.06)" strokeWidth="1" />

      {/* === HORIZONTAL LINES === */}
      <line x1="50%" y1="15%" x2="100%" y2="15%" stroke="hsl(217 91% 60% / 0.1)" strokeWidth="1" />
      <line x1="45%" y1="25%" x2="100%" y2="25%" stroke="hsl(217 91% 60% / 0.08)" strokeWidth="1" />
      <line x1="55%" y1="35%" x2="100%" y2="35%" stroke="hsl(217 91% 60% / 0.14)" strokeWidth="1" filter="url(#glow)" />
      <line x1="48%" y1="45%" x2="100%" y2="45%" stroke="hsl(217 91% 60% / 0.06)" strokeWidth="1" />
      <line x1="52%" y1="55%" x2="100%" y2="55%" stroke="hsl(217 91% 60% / 0.12)" strokeWidth="1" filter="url(#glow)" />
      <line x1="50%" y1="65%" x2="100%" y2="65%" stroke="hsl(217 91% 60% / 0.1)" strokeWidth="1" />
      <line x1="55%" y1="75%" x2="100%" y2="75%" stroke="hsl(217 91% 60% / 0.14)" strokeWidth="1" filter="url(#glow)" />
      <line x1="48%" y1="85%" x2="100%" y2="85%" stroke="hsl(217 91% 60% / 0.08)" strokeWidth="1" />
      <line x1="52%" y1="92%" x2="100%" y2="92%" stroke="hsl(217 91% 60% / 0.06)" strokeWidth="1" />

      {/* === DIAGONAL LINES radiating from bell center (~70%, 50%) === */}
      <line x1="70%" y1="50%" x2="100%" y2="10%" stroke="hsl(217 91% 60% / 0.1)" strokeWidth="1" filter="url(#glow)" />
      <line x1="70%" y1="50%" x2="100%" y2="30%" stroke="hsl(217 91% 60% / 0.08)" strokeWidth="1" />
      <line x1="70%" y1="50%" x2="100%" y2="70%" stroke="hsl(217 91% 60% / 0.08)" strokeWidth="1" />
      <line x1="70%" y1="50%" x2="100%" y2="90%" stroke="hsl(217 91% 60% / 0.1)" strokeWidth="1" filter="url(#glow)" />
      <line x1="70%" y1="50%" x2="50%" y2="0%" stroke="hsl(217 91% 60% / 0.06)" strokeWidth="1" />
      <line x1="70%" y1="50%" x2="50%" y2="100%" stroke="hsl(217 91% 60% / 0.06)" strokeWidth="1" />
      <line x1="70%" y1="50%" x2="40%" y2="20%" stroke="hsl(217 91% 60% / 0.04)" strokeWidth="1" />
      <line x1="70%" y1="50%" x2="40%" y2="80%" stroke="hsl(217 91% 60% / 0.04)" strokeWidth="1" />

      {/* === JUNCTION DOTS (circuit nodes) === */}
      {/* Main bright dots */}
      <circle cx="62%" cy="35%" r="3" fill="hsl(217 91% 60% / 0.6)" filter="url(#glowStrong)" />
      <circle cx="78%" cy="25%" r="3" fill="hsl(217 91% 60% / 0.5)" filter="url(#glowStrong)" />
      <circle cx="68%" cy="65%" r="3" fill="hsl(217 91% 60% / 0.5)" filter="url(#glowStrong)" />
      <circle cx="83%" cy="55%" r="3" fill="hsl(217 91% 60% / 0.6)" filter="url(#glowStrong)" />
      <circle cx="93%" cy="35%" r="3" fill="hsl(217 91% 60% / 0.4)" filter="url(#glow)" />
      <circle cx="88%" cy="75%" r="3" fill="hsl(217 91% 60% / 0.5)" filter="url(#glowStrong)" />
      <circle cx="55%" cy="55%" r="2.5" fill="hsl(217 91% 60% / 0.4)" filter="url(#glow)" />
      <circle cx="73%" cy="15%" r="2.5" fill="hsl(217 91% 60% / 0.4)" filter="url(#glow)" />
      <circle cx="73%" cy="85%" r="2.5" fill="hsl(217 91% 60% / 0.4)" filter="url(#glow)" />
      <circle cx="93%" cy="92%" r="2" fill="hsl(217 91% 60% / 0.3)" filter="url(#glow)" />
      <circle cx="97%" cy="45%" r="2" fill="hsl(217 91% 60% / 0.3)" filter="url(#glow)" />
      
      {/* Small dots */}
      <circle cx="62%" cy="15%" r="2" fill="hsl(217 91% 60% / 0.3)" />
      <circle cx="55%" cy="25%" r="2" fill="hsl(217 91% 60% / 0.25)" />
      <circle cx="78%" cy="45%" r="2" fill="hsl(217 91% 60% / 0.35)" />
      <circle cx="68%" cy="45%" r="2" fill="hsl(217 91% 60% / 0.25)" />
      <circle cx="83%" cy="85%" r="2" fill="hsl(217 91% 60% / 0.3)" />
      <circle cx="88%" cy="15%" r="1.5" fill="hsl(217 91% 60% / 0.25)" />
      <circle cx="55%" cy="75%" r="1.5" fill="hsl(217 91% 60% / 0.2)" />
      <circle cx="62%" cy="92%" r="1.5" fill="hsl(217 91% 60% / 0.2)" />

      {/* === SHORT CONNECTOR SEGMENTS (L-shaped circuit traces) === */}
      {/* Top right area */}
      <polyline points="78%,25% 78%,20% 83%,20%" fill="none" stroke="hsl(217 91% 60% / 0.2)" strokeWidth="1" filter="url(#glow)" />
      <polyline points="88%,15% 88%,25% 93%,25%" fill="none" stroke="hsl(217 91% 60% / 0.15)" strokeWidth="1" />
      
      {/* Middle area */}
      <polyline points="62%,35% 62%,45% 68%,45%" fill="none" stroke="hsl(217 91% 60% / 0.2)" strokeWidth="1" filter="url(#glow)" />
      <polyline points="83%,55% 83%,65% 88%,65%" fill="none" stroke="hsl(217 91% 60% / 0.18)" strokeWidth="1" filter="url(#glow)" />
      
      {/* Bottom area */}
      <polyline points="68%,65% 68%,75% 73%,75%" fill="none" stroke="hsl(217 91% 60% / 0.15)" strokeWidth="1" />
      <polyline points="88%,75% 88%,85% 83%,85%" fill="none" stroke="hsl(217 91% 60% / 0.2)" strokeWidth="1" filter="url(#glow)" />
      <polyline points="73%,85% 73%,92% 78%,92%" fill="none" stroke="hsl(217 91% 60% / 0.12)" strokeWidth="1" />

      {/* Left side faint lines */}
      <line x1="30%" y1="20%" x2="30%" y2="40%" stroke="hsl(217 91% 60% / 0.03)" strokeWidth="1" />
      <line x1="35%" y1="60%" x2="35%" y2="85%" stroke="hsl(217 91% 60% / 0.03)" strokeWidth="1" />
      <line x1="20%" y1="30%" x2="45%" y2="30%" stroke="hsl(217 91% 60% / 0.02)" strokeWidth="1" />
      <line x1="25%" y1="70%" x2="48%" y2="70%" stroke="hsl(217 91% 60% / 0.02)" strokeWidth="1" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Deep dark background base */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Circuit board SVG */}
      <CircuitBackground />
      
      {/* Radial glow from bell center */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          right: '5%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle at center, hsl(217 91% 60% / 0.08) 0%, hsl(252 87% 65% / 0.04) 30%, transparent 65%)',
        }}
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="relative z-10">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-display-lg lg:text-display-xl font-bold mb-6 leading-[1.1] tracking-tight"
            >
              Never Miss a
              <br />
              <span className="text-gradient">Coding Contest</span>
              <br />
              Again
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-md leading-relaxed"
            >
              The smart reminder service for your interest online coding contest
              rounds can keep your, platforms how things coding the dreams
              contest again or by AlgoBell.
            </motion.p>

            {/* Pill Badges / Chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>30 min before</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>WhatsApp & Email</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm text-sm text-muted-foreground">
                <Layers className="w-4 h-4 text-primary" />
                <span>5 Platforms</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary via-primary to-glow-accent text-primary-foreground btn-shine px-8 text-base rounded-full h-12 glow-primary-sm hover:shadow-glow transition-shadow"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base px-8 rounded-full h-12 border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  See How It Works
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Right: Glowing Bell Puck */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              {/* Outermost soft glow */}
              <div 
                className="absolute rounded-full animate-pulse"
                style={{
                  width: '420px',
                  height: '420px',
                  background: 'radial-gradient(circle, hsl(217 91% 60% / 0.1) 0%, hsl(252 87% 65% / 0.05) 40%, transparent 70%)',
                }}
              />

              {/* Outer ring */}
              <div 
                className="absolute rounded-full border border-primary/20"
                style={{ width: '340px', height: '340px' }}
              />

              {/* Middle ring with subtle glow */}
              <div 
                className="absolute rounded-full border border-primary/15"
                style={{ width: '290px', height: '290px' }}
              />

              {/* Dark puck / main circle */}
              <div 
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: '240px',
                  height: '240px',
                  background: 'radial-gradient(circle at 50% 40%, hsl(222 40% 14%) 0%, hsl(222 47% 8%) 60%, hsl(222 47% 6%) 100%)',
                  boxShadow: `
                    0 0 60px -15px hsl(217 91% 60% / 0.3),
                    0 0 120px -30px hsl(252 87% 65% / 0.15),
                    inset 0 1px 0 0 hsl(217 91% 60% / 0.1),
                    inset 0 -2px 10px 0 hsl(222 47% 4% / 0.5)
                  `,
                  border: '1px solid hsl(217 91% 60% / 0.15)',
                }}
              >
                {/* Inner subtle ring */}
                <div 
                  className="absolute rounded-full"
                  style={{
                    width: '200px',
                    height: '200px',
                    border: '1px solid hsl(217 91% 60% / 0.08)',
                  }}
                />

                {/* Bell glow backdrop */}
                <div 
                  className="absolute rounded-full"
                  style={{
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, hsl(217 91% 60% / 0.15) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                  }}
                />

                {/* Bell Icon with neon glow */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <Bell 
                    className="w-20 h-20"
                    style={{
                      color: 'hsl(217 91% 65%)',
                      filter: 'drop-shadow(0 0 20px hsl(217 91% 60% / 0.6)) drop-shadow(0 0 40px hsl(252 87% 65% / 0.3))',
                    }}
                    strokeWidth={1.5}
                  />
                </motion.div>
              </div>

              {/* Orbiting small dots */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute"
                style={{ width: '340px', height: '340px' }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/50" />
                <div className="absolute bottom-4 right-8 w-1 h-1 rounded-full bg-primary/40" />
                <div className="absolute top-1/3 left-2 w-1 h-1 rounded-full bg-primary/30" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom right star decoration */}
      <motion.div
        animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 right-12 pointer-events-none"
        style={{ color: 'hsl(217 91% 60% / 0.15)' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 0 L18 14 L32 16 L18 18 L16 32 L14 18 L0 16 L14 14 Z" />
        </svg>
      </motion.div>
    </section>
  );
}
