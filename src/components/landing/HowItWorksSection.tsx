import { motion } from "framer-motion";
import { CalendarCheck, Sparkles, Video } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    step: "1",
    title: "Choose your Drop",
    description: "Pick the next scheduled room and verify once so you're ready when it opens.",
  },
  {
    icon: Video,
    step: "2",
    title: "45-second anonymous call",
    description: "Meet one verified stranger at a time with no profiles, no swiping, and no raw video storage.",
  },
  {
    icon: Sparkles,
    step: "3",
    title: "Spark or Pass",
    description: "Decide privately. Only mutual Sparks reveal identity and unlock chat after the call.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-28">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 block text-xs uppercase tracking-luxury text-primary/60">What happens next</span>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl lg:text-5xl">
            Three steps. No swiping.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Verity is structured on purpose. You know when the room opens, what the call lasts, and how identity reveal works before you join.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/20"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-serif text-base text-primary">{item.step}</span>
                </div>
                <item.icon className="h-5 w-5 text-primary/70" />
              </div>
              <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
