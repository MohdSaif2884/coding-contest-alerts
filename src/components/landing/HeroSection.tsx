import { ArrowRight, Bell, Sparkles, Zap, Shield, Clock, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Smart Contest Reminders for Developers</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-display-lg lg:text-display-xl font-bold mb-6"
          >
            Never Miss a{" "}
            <span className="text-gradient">Coding Contest</span>
            <br />
            Again{" "}
            <motion.span
              className="inline-block"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 1, delay: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              🔔
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            AlgoBell sends smart reminders before your favorite contests start.
            Just set "how long before" — we handle the rest.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/dashboard">
              <Button size="lg" className="glow-primary btn-shine text-base px-8">
                Start for $1/month
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contests">
              <Button size="lg" variant="outline" className="text-base px-8">
                Explore Contests
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>10+ platforms supported</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Setup in 2 minutes</span>
            </div>
          </motion.div>
        </div>

        {/* Hero illustration / Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl" />
            
            {/* Dashboard Preview */}
            <div className="relative glass rounded-2xl p-6 md:p-8 border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contest Card */}
                <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                      CF
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Codeforces Round #912</h4>
                      <p className="text-xs text-muted-foreground">Starts in 2h 30m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">Div. 2</span>
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Subscribed</span>
                  </div>
                </div>

                {/* Notification Preview */}
                <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    Reminder Sent!
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <MessageSquare className="w-3 h-3 text-green-500" />
                      <span className="text-muted-foreground">WhatsApp</span>
                      <span className="text-accent">✓ Delivered</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="w-3 h-3 text-blue-500" />
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-accent">✓ Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                  <h4 className="font-semibold text-sm mb-3">Your Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Attended</span>
                      <span className="font-semibold text-accent">47</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Missed</span>
                      <span className="font-semibold text-destructive">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Upcoming</span>
                      <span className="font-semibold text-primary">12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
