import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const faqs = [
  {
    question: "Can my video call be recorded?",
    answer:
      "No. Verity never records video or audio. During live calls, our AI safety system processes short text-based transcript snippets in real time to detect policy violations. These snippets are retained for up to 30 days for safety review, then permanently deleted.",
  },
  {
    question: "What happens if someone harasses me during a call?",
    answer:
      "Tap the exit button to leave immediately — no explanation needed. Our AI monitors calls in real time and can flag concerning behaviour automatically. You can also report a user after any call. Every report is reviewed, and every moderation decision can be appealed.",
  },
  {
    question: "What is a Drop?",
    answer:
      "A Drop is a scheduled, themed speed-dating session. Examples include Night Owls (late evening), Over 35, Creatives & Makers, and Introvert Hours. You RSVP to a Drop, and when it starts, you're matched with verified strangers for 45-second anonymous video calls.",
  },
  {
    question: "What happens after a call?",
    answer:
      "After each 45-second call, both you and the other person independently choose Spark (interested) or Pass (not interested). If you both choose Spark, your identities are revealed and a private chat opens. If either person chooses Pass, neither person is notified — there is no rejection notification. Dignity, always.",
  },
  {
    question: "How does identity verification work?",
    answer:
      "Every member completes a safety pledge and age verification during onboarding. You must be 18 or older to use Verity.",
  },
  {
    question: "What is the Chemistry Replay Vault?",
    answer:
      "The Replay Vault stores text-based AI session notes and conversation timestamps from your calls — never video or audio. It helps you remember the moments that mattered between Drops.",
  },
  {
    question: "What is Guardian Net?",
    answer:
      "Guardian Net lets you broadcast a one-tap safety signal to a trusted contact before a call: 'I'm in a Verity call until [time].' Your contact knows you're safe without needing your location.",
  },
  {
    question: "Is Verity free?",
    answer:
      "Yes. The free tier includes Drops, 45-second calls, mutual Spark matching, and AI moderation. Verity Pass (A$9.99/month for founding members) adds the Chemistry Replay Vault, Spark Reflection insights, expanded Guardian Net, and priority Drop access.",
  },
  {
    question: "Can I use Verity outside major cities?",
    answer:
      "Yes. Verity is fully online — all you need is a stable internet connection. Drops are themed by interest and energy, not geography. Our early Drops focus on Australian time zones.",
  },
  {
    question: "What happens to my data if I delete my account?",
    answer:
      "All personal data is removed. Any retained call metadata from the previous 30 days is permanently deleted. Verity does not sell or share personal data with third parties.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ — Verity | Your Questions Answered</title>
        <meta
          name="description"
          content="Frequently asked questions about Verity's anonymous speed dating: privacy, Spark mechanics, verification, recordings, data, and safety."
        />
        <link rel="canonical" href="https://getverity.com.au/faq" />
        <meta property="og:title" content="FAQ — Verity | Your Questions Answered" />
        <meta property="og:description" content="Frequently asked questions about Verity's anonymous speed dating: privacy, Spark mechanics, verification, recordings, data, and safety." />
        <meta property="og:url" content="https://getverity.com.au/faq" />
        <meta property="og:image" content="https://getverity.com.au/og-logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ — Verity | Your Questions Answered" />
        <meta name="twitter:description" content="Frequently asked questions about Verity's anonymous speed dating: privacy, Spark mechanics, verification, recordings, data, and safety." />
        <meta name="twitter:image" content="https://getverity.com.au/og-logo.png" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs tracking-luxury uppercase text-primary/60 mb-4 block">
              Questions
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
              Frequently asked questions
            </h1>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="font-serif text-foreground text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-16">
            <p className="text-sm text-muted-foreground mb-6">
              Still have questions? Read our{" "}
              <Link to="/safety" className="text-primary hover:underline">
                Safety Promise
              </Link>{" "}
              or{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <Link to="/onboarding">
              <Button variant="gold" size="lg" className="group">
                Get started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
