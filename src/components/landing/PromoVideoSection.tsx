import { motion } from "framer-motion";

const PromoVideoSection = () => {
  return (
    <section className="relative bg-black py-20 md:py-32 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,83,0.06)_0%,_transparent_70%)]" />
      
      <div className="relative z-10 container max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] tracking-luxury uppercase text-primary/60 mb-4"
        >
          See the difference
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4"
        >
          Real Connection Starts{" "}
          <span className="text-gold-gradient italic">Here</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg font-light mb-12 max-w-xl mx-auto"
        >
          Forty-five seconds. Real voice, real face. That's all it takes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="rounded-xl overflow-hidden ring-1 ring-primary/20 shadow-2xl shadow-primary/10 max-w-3xl mx-auto"
        >
          <video
            controls
            preload="metadata"
            className="w-full aspect-video bg-black"
            poster=""
          >
            <source
              src="https://cdn.jsdelivr.net/gh/joshcabana/GetVerity.1@main/public/videos/verity-promo-video.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoVideoSection;
