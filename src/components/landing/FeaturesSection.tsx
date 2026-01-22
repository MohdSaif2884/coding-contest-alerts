import { Bell, Brain, Clock, Globe, Mail, MessageSquare, Shield, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Clock,
    title: "Event-Based Reminders",
    description: "No fixed times. Just set 'remind me X minutes before' and we calculate the rest.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Alerts",
    description: "Get instant notifications on WhatsApp. Works globally, no app needed.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Bell,
    title: "Web Push",
    description: "Browser notifications that work even when you're not on the site.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Mail,
    title: "Email Digests",
    description: "Daily or weekly summaries of upcoming contests in your inbox.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Volume2,
    title: "In-App Alarm",
    description: "Custom alarm sounds when a contest is about to start.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Auto Timezone",
    description: "We detect your timezone and show all times in your local zone.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Brain,
    title: "Smart Suggestions",
    description: "'You usually join late — want a 15-min reminder?' AI learns your habits.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Sleep Hours Filter",
    description: "No reminders during your sleep hours. We respect your rest.",
    gradient: "from-teal-500 to-cyan-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />
      
      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">FEATURES</span>
          <h2 className="text-3xl md:text-display-sm font-bold mb-4">
            Everything You Need to <span className="text-gradient">Stay Sharp</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for competitive programmers who value every minute.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
