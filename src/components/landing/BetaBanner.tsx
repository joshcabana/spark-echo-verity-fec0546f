import { Sparkles } from "lucide-react";

const BetaBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/10">
      <div className="container max-w-5xl mx-auto px-6 py-2 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <p className="text-xs tracking-luxury uppercase text-primary/80">
          Early Access Beta — Shaping the future of dating, together
        </p>
        <Sparkles className="w-3.5 h-3.5 text-primary" />
      </div>
    </div>
  );
};

export default BetaBanner;
