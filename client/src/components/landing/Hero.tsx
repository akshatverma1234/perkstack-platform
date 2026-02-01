"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Access",
    desc: "Skip the wait. Get verified and claim your credits within minutes.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Shield,
    title: "Vetted Partners",
    desc: "We hand-pick every tool to ensure it's actually useful for your stack.",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    icon: Sparkles,
    title: "Runway Extension",
    desc: "Access $100k+ in savings to keep your startup building longer.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

export const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
  }, [isLoggedIn]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-[100%] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-slate-900/40 border border-white/10 rounded-full px-4 py-1.5 mb-10 backdrop-blur-xl shadow-2xl"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-300">
              Exclusive SaaS deals added this morning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[0.95]"
          >
            Scale faster with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-indigo-300 to-indigo-600">
              founder-only perks
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400/90 mb-12 max-w-2xl leading-relaxed font-medium"
          >
            We've negotiated directly with the biggest names in tech to save
            your startup over $100k in upfront costs. No fluff, just pure
            runway.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/deals">
              <button className="h-14 px-8 text-md font-bold rounded-2xl group bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center">
                Explore Deals
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            {!isLoggedIn && (
              <Link href="/login">
                <button className="h-14 px-8 text-md font-bold rounded-2xl border border-white/5 bg-transparent hover:bg-white/5 text-white transition-all flex items-center justify-center">
                  Join For Free
                </button>
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 w-full"
          >
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 hover:border-white/10 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div
                  className={`h-14 w-14 rounded-2xl ${feat.bg} flex items-center justify-center mb-6 border border-white/5`}
                >
                  <feat.icon className={`h-7 w-7 ${feat.color}`} />
                </div>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  {feat.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-32 max-w-3xl mx-auto space-y-12 text-center">
          <ScrollReveal>
            Premium SaaS deals built specifically for early-stage
          </ScrollReveal>

          <ScrollReveal>
            We work directly with cloud providers, marketing platforms, and
            developer tools to unlock benefits that are normally out of reach.
          </ScrollReveal>

          <ScrollReveal>
            Some deals are public. Others are reserved for verified founders to
            protect real partner value.
          </ScrollReveal>

          <ScrollReveal>
            Verify your startup, unlock exclusive access, and extend your runway
            without sacrificing quality.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
