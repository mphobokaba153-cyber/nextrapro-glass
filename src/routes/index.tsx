import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Smartphone,
  Sparkles,
} from "lucide-react";
import heroPhone from "@/assets/hero-phone.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NextraPro — Professional Mobile Trading Platform" },
      {
        name: "description",
        content:
          "Empower your clients with professional mobile trading bots. Real-time synchronization, any broker support, and zero technical setup.",
      },
      {
        property: "og:title",
        content: "NextraPro — Professional Mobile Trading Platform",
      },
      {
        property: "og:description",
        content:
          "Empower your clients with professional mobile trading bots. Real-time synchronization, any broker support, and zero technical setup.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FAQS = [
  {
    question: "Is NextraPro itself a trading robot or EA?",
    answer:
      "No. NextraPro is not a trading robot. We help mentors turn their trading into mobile apps for their clients. Different mentors create different trading strategies that clients can use on their phones.",
  },
  {
    question: "Which brokers are compatible with NextraPro?",
    answer:
      "NextraPro works with ANY broker that has MT4 and MT5 — no limits. Other platforms only work with some brokers. Whether you use Exness, IC Markets, XM, or any other broker, we work with them all. You can choose any broker you want.",
  },
  {
    question: "How can I get access to a license key?",
    answer:
      "License keys are provided exclusively by mentors registered on our platform. You need to connect with a mentor who will provide you with a key for their specific trading strategy or Expert Advisor. NextraPro doesn't directly issue license keys to end users but instead facilitates the connection between mentors and clients.",
  },
  {
    question: "What is a mentor verification code and where do I use it?",
    answer:
      "A mentor verification code is a unique identifier that confirms your mentor is officially registered on our platform. Your mentor should provide this code to you directly. You can enter this code in the app's Help section to verify their legitimacy and connect with their trading strategies securely.",
  },
  {
    question: "Do stop loss and take profit changes sync to client accounts?",
    answer:
      "Yes. When a mentor adjusts the stop loss or take profit on a trade, the change syncs instantly to every connected client account, so everyone's trade management stays aligned in real time.",
  },
];

const TRUST_POINTS = [
  "No credit card required",
  "Setup in 5 minutes",
  "Cancel anytime",
];

function FaqItem({
  faq,
  open,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass rounded-2xl overflow-hidden transition-colors duration-300 hover:bg-white/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {faq.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Ambient glow orbs */}
      <div
        className="orb h-[28rem] w-[28rem] -top-32 -left-24 bg-primary/40"
        aria-hidden
      />
      <div
        className="orb h-[22rem] w-[22rem] top-40 right-[-6rem] bg-primary-glow/35"
        style={{ animationDelay: "-6s" }}
        aria-hidden
      />
      <div
        className="orb h-[30rem] w-[30rem] bottom-[-10rem] left-1/3 bg-fuchsia-500/20"
        style={{ animationDelay: "-11s" }}
        aria-hidden
      />

      {/* Glass navigation */}
      <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
        <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              NEXTRA&nbsp;<span className="text-gradient">PRO</span>
            </span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#faq"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Sign in
            </a>
            <a
              href="#faq"
              className="btn-gradient rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              Get started
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
          <div className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-foreground sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Next-Gen Trading Platform
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Mobile Trading
            <span className="text-gradient block">Revolutionized</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Empower your clients with{" "}
            <span className="font-semibold text-foreground">professional</span>{" "}
            mobile trading bots.{" "}
            <span className="font-semibold text-foreground">
              Real-time synchronization
            </span>
            ,{" "}
            <span className="font-semibold text-foreground">
              any broker support
            </span>
            , and{" "}
            <span className="font-semibold text-foreground">
              zero technical setup
            </span>
            .
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#faq"
              className="btn-gradient group inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-display text-base font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="#faq"
              className="glass inline-flex items-center rounded-2xl px-7 py-3.5 font-display text-base font-semibold text-foreground transition-colors duration-200 hover:bg-white/10"
            >
              Already a member? Sign in
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/20">
                  <Check className="h-3 w-3 text-emerald-300" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          {/* App render in glass frame */}
          <div className="glass relative mt-16 w-full max-w-md rounded-[2rem] p-3 sm:max-w-lg">
            <div className="overflow-hidden rounded-[1.6rem]">
              <img
                src={heroPhone}
                alt="NextraPro mobile trading app"
                width={896}
                height={1152}
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* Store buttons */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Available on mobile devices
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#faq"
                className="glass flex items-center gap-3 rounded-2xl px-5 py-2.5 transition-colors hover:bg-white/10"
              >
                <Smartphone className="h-5 w-5 text-foreground" />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-muted-foreground">
                    Download on
                  </span>
                  <span className="block font-display text-sm font-semibold text-foreground">
                    Android
                  </span>
                </span>
              </a>
              <span
                className="glass flex items-center gap-3 rounded-2xl px-5 py-2.5 opacity-40"
                aria-disabled
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-muted-foreground">
                    Coming soon to
                  </span>
                  <span className="block font-display text-sm font-semibold">
                    iOS
                  </span>
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-4 pb-24 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Common Questions
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Answers to questions people ask about NEXTRA PRO.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={faq.question}
                faq={faq}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-glass-border bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            NEXTRA&nbsp;<span className="text-gradient">PRO</span>
          </span>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#faq" className="transition-colors hover:text-foreground">
              Terms &amp; Privacy
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 NEXTRA PRO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
