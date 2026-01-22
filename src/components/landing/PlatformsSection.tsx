import { motion } from "framer-motion";

const platforms = [
  { name: "Codeforces", logo: "CF", color: "from-red-500 to-orange-500" },
  { name: "LeetCode", logo: "LC", color: "from-yellow-500 to-orange-500" },
  { name: "CodeChef", logo: "CC", color: "from-amber-600 to-yellow-500" },
  { name: "AtCoder", logo: "AC", color: "from-gray-700 to-gray-500" },
  { name: "TopCoder", logo: "TC", color: "from-blue-600 to-blue-400" },
  { name: "HackerRank", logo: "HR", color: "from-green-600 to-emerald-500" },
  { name: "HackerEarth", logo: "HE", color: "from-blue-500 to-cyan-500" },
  { name: "Kick Start", logo: "KS", color: "from-red-500 to-pink-500" },
];

export function PlatformsSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">SUPPORTED PLATFORMS</span>
          <h2 className="text-3xl md:text-display-sm font-bold mb-4">
            All Your <span className="text-gradient">Favorite Platforms</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We sync contests from all major competitive programming platforms automatically.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform`}>
                {platform.logo}
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {platform.name}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          ...and many more coming soon!
        </motion.p>
      </div>
    </section>
  );
}
