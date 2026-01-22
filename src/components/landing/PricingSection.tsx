import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Try AlgoBell risk-free",
    features: [
      "Web push notifications",
      "Email reminders",
      "Up to 3 platforms",
      "Basic reminder offsets",
      "Community support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$1",
    period: "/month",
    description: "Everything you need to never miss a contest",
    features: [
      "WhatsApp alerts",
      "Web push notifications",
      "Email reminders",
      "In-App alarm sounds",
      "Unlimited platforms",
      "Custom reminder offsets",
      "Smart AI suggestions",
      "Sleep hours filter",
      "Priority support",
    ],
    cta: "Get Pro",
    popular: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent" />
      
      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">PRICING</span>
          <h2 className="text-3xl md:text-display-sm font-bold mb-4">
            Simple, <span className="text-gradient">Affordable</span> Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Less than a cup of coffee per month. Because missing a contest is priceless.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className={`glass rounded-2xl p-8 h-full border transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary/50 shadow-lg shadow-primary/10' 
                  : 'border-border/50 hover:border-primary/30'
              }`}>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.popular ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/dashboard">
                  <Button 
                    className={`w-full ${plan.popular ? 'glow-primary' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          All plans include a 7-day money-back guarantee. No questions asked.
        </motion.p>
      </div>
    </section>
  );
}
