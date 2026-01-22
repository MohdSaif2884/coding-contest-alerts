import { Bell, Clock, Smartphone, Zap } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Smartphone,
    title: "Pick Your Platforms",
    description: "Select from Codeforces, LeetCode, CodeChef, AtCoder, and more. We auto-fetch all upcoming contests.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Set Reminder Offsets",
    description: "Choose when to be reminded: 60 min, 30 min, 10 min before, or when the contest goes LIVE.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Bell,
    title: "Choose Channels",
    description: "Get notified via WhatsApp, Web Push, Email, or In-App Alarm. Never miss a beat.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Compete & Win",
    description: "We handle the timing. You focus on solving problems and climbing the leaderboards.",
    color: "from-green-500 to-emerald-500",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">HOW IT WORKS</span>
          <h2 className="text-3xl md:text-display-sm font-bold mb-4">
            Simple Setup, <span className="text-gradient">Smart Reminders</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No complex scheduling. Just tell us how early you want to be reminded — we do the math.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="glass rounded-2xl p-6 h-full card-hover border border-border/50 group-hover:border-primary/30 transition-colors">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
