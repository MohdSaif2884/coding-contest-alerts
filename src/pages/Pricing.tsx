import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/landing/PricingSection";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "क्या AlgoBell free है?",
    answer: "हाँ! AlgoBell पूरी तरह से free है। Web Push, Email notifications, और phone alarm सब free में मिलता है। Pro plan में WhatsApp alerts और extra features हैं।"
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes! You can cancel your subscription at any time. There are no long-term contracts or hidden fees."
  },
  {
    question: "What platforms do you support?",
    answer: "We support Codeforces, LeetCode, CodeChef, AtCoder, TopCoder, HackerRank, HackerEarth, and more. We're constantly adding new platforms."
  },
  {
    question: "How do WhatsApp notifications work?",
    answer: "After verifying your phone number, you'll receive contest reminders directly on WhatsApp. It's instant, reliable, and works globally."
  },
  {
    question: "What if I miss a notification?",
    answer: "We send notifications through multiple channels to ensure you never miss a contest. You can also check the dashboard for upcoming contests anytime."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes! We offer a 7-day money-back guarantee. If you're not satisfied, just contact us and we'll refund your payment, no questions asked."
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh" />
          <div className="container-tight relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-display font-bold mb-4">
                Simple, <span className="text-gradient">Transparent</span> Pricing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start free, upgrade when you're ready. Less than a cup of coffee per month.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <PricingSection />

        {/* FAQ Section */}
        <section className="section-padding">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="text-sm font-medium text-primary mb-4 block">FAQ</span>
              <h2 className="text-3xl md:text-display-sm font-bold mb-4">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="glass rounded-xl border border-border/50 px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
