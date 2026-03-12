import { motion } from "framer-motion";

const stats = [
  { value: "78%", label: "of dating-app users experience burnout", source: "Forbes Health" },
  { value: "80%", label: "of women report dating fatigue", source: "Forbes Health" },
  { value: "41%", label: "cite ghosting as the top cause", source: "Forbes Health" },
];

const StatsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-luxury uppercase text-primary/60 mb-4 block">
            The reality
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            The swipe economy is broken.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We built Verity because the numbers demanded something fundamentally different.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 text-center"
            >
              <div className="font-serif text-3xl md:text-4xl text-gold-gradient mb-3">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground/50">{stat.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
