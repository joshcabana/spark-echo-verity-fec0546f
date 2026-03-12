import { motion } from "framer-motion";
import { Video, ShieldCheck, Brain, Shield, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "45-Second Anonymous Video",
    description:
      "Two strangers, one fully anonymous live call. No profiles, no photos, no bios — just real human connection in its purest form.",
  },
  {
    icon: ShieldCheck,
    title: "Mutual-Spark Privacy",
    description:
      "Both choose Spark or Pass independently. Only mutual sparks reveal identities. No rejection notifications — ever.",
  },
  {
    icon: Brain,
    title: "Spark Reflection",
    description:
      "Private post-call AI insight for personal growth. Tone and engagement analysis — e.g., 'You both showed highest energy discussing travel.'",
  },
  {
    icon: Shield,
    title: "Guardian Net",
    description:
      "One tap to share a safe-call signal with a trusted friend. They see only 'in Verity call until 9:12 pm' — nothing else.",
  },
  {
    icon: MessageCircle,
    title: "Scheduled Drops",
    description:
      "RSVP to themed, time-limited sessions. Night Owls, Tech Professionals, Creatives, Over 35 — join the Drop that fits your energy.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-luxury uppercase text-primary/60 mb-4 block">
            Features that shouldn't need to be new
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            What nobody else is building
          </h2>
        </motion.div>

        {/* Top row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {features.slice(0, 3).map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-card border border-border rounded-lg p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_40px_hsl(43_72%_55%/0.06)]"
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-500">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom row: 2 cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.slice(3).map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i + 3) * 0.1 }}
              className="group bg-card border border-border rounded-lg p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_40px_hsl(43_72%_55%/0.06)]"
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-500">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
