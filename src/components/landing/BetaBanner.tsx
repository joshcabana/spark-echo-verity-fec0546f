import { Sparkles } from "lucide-react";

const BetaBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/10 relative z-50">
      <div className="container max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
        <p className="text-[10px] sm:text-xs tracking-luxury uppercase text-primary/80 text-center">
          <span className="sm:hidden">Early Access Beta</span>
          <span className="hidden sm:inline">Early Access Beta — Shaping the future of dating, together</span>
        </p>
        <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
      </div>
    </div>
  );
};

export default BetaBanner;
