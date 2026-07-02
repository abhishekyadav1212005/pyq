"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Award,
  Zap,
  Target,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "15,000+", label: "Physio Students" },
    { value: "500,000+", label: "Questions Solved" },
    { value: "94.2%", label: "Success Rate" },
    { value: "10+", label: "Exams Covered" }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Previous Year Library",
      desc: "Instant access to 10+ years of solved physiotherapy MCQs from AIIMS, ESIC, DSSSB, RRB, and state PSCs.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Mock Test Engine",
      desc: "Simulate high-pressure exam environments with real-time timers, negative markings, and instant percentile grading.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: Flame,
      title: "Gamified Streaks",
      desc: "Earn XP, unlock achievement badges, and protect your study streak. Study physics and clinical therapies like a game.",
      color: "from-orange-500 to-rose-500"
    },
    {
      icon: Sparkles,
      title: "AI Explanation Assistant",
      desc: "Stuck on a clinical scenario? Ask the AI Assistant to break down joint mechanics, electrotherapy polarities, or nerve pathways.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Weak Area Analytics",
      desc: "Intelligent error-logging maps out your weak subjects. Revise incorrect answers and targeted topics automatically.",
      color: "from-indigo-500 to-violet-500"
    },
    {
      icon: Zap,
      title: "Spaced Repetition Cards",
      desc: "Flashcards integrated with SuperMemo schedule reviews before you forget. Retain muscle origins and nerve roots forever.",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const faqs = [
    {
      q: "Which competitive exams are covered under PhysioPrep?",
      a: "We support major physiotherapy recruitment exams including AIIMS, ESIC, DSSSB, RRB, NORCET, NHM, State PSCs, and academic post-graduate entrance exams."
    },
    {
      q: "How does the Spaced Repetition flashcard system work?",
      a: "Based on the SuperMemo-2 algorithm, you rate each card's difficulty. The engine automatically schedules the card to reappear tomorrow, in 3 days, or 10 days, maximizing long-term memory retention."
    },
    {
      q: "Is there negative marking in mock tests?",
      a: "Yes! Each mock test has customizable configurations (e.g. -0.25 for AIIMS or -0.33 for ESIC) to mimic the exact official exam schemes."
    },
    {
      q: "How does the AI assistant help me study?",
      a: "The AI assistant breaks down complex clinical MCQs, explains the biomechanical rationale behind joint glides, suggests memory-anchoring mnemonics, and generates customized practice questions."
    }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:py-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
          >
            <Sparkles className="w-4. h-4. text-primary animate-pulse" />
            Ultimate Physiotherapy Competitive Exam Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Master Physiotherapy Exams. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
              LeetCode & Duolingo
            </span> Style.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed"
          >
            Crack your government recruitment and licensing exams with gamified daily streaks, flashcards, a mock exam engine, and instant explanations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href={user ? "/dashboard" : "/auth"}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 btn-duo-primary"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 bg-secondary/50 hover:bg-secondary border border-border rounded-xl font-bold text-sm transition-colors flex items-center justify-center"
            >
              Explore Features
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="border-y border-border py-12 bg-card/45 backdrop-blur-sm px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Features Grid */}
      <section id="features" className="py-20 md:py-32 px-6 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built to Excel Under Pressure</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Every feature is calibrated to help physiotherapy students drill clincal subjects and master theories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-border glass-card hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Testimonials */}
      <section id="testimonials" className="py-20 bg-secondary/20 border-y border-border px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">What Top Rankers Say</h2>
            <p className="text-muted-foreground text-sm">Real stories from students who cleared recruitment boards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-4">
              <p className="text-sm italic leading-relaxed text-foreground/80">
                &ldquo;PhysioPrep turned exam prep into a game. The daily streak kept me accountable, and the spaced repetition cards helped me memorize cranial nerve roots and muscle dermatomes that I always used to mix up. I got Rank 8 in AIIMS Patna!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                  SK
                </div>
                <div>
                  <p className="text-xs font-semibold">Siddharth Kothari</p>
                  <p className="text-[10px] text-muted-foreground">AIIMS Physiotherapist, SVNIRTAR Alumnus</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-4">
              <p className="text-sm italic leading-relaxed text-foreground/80">
                &ldquo;The Mock Test engine is phenomenal. The negative marking simulation (-0.25) trained me to stop guessing. The AI explainer was like having a tutor next to me, showing me joint glide rules. Highly recommended!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700">
                  AR
                </div>
                <div>
                  <p className="text-xs font-semibold">Ananya Roy</p>
                  <p className="text-[10px] text-muted-foreground">ESIC Officer, KEM Alumna</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Placeholder */}
      <section id="pricing" className="py-20 max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Invest in Your Career</h2>
          <p className="text-muted-foreground text-sm">Affordable plans tailored for physiotherapy students.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Free Basic</h3>
              <p className="text-muted-foreground text-xs">Access to basic PYQ library and limited mock tests.</p>
              <div className="text-3xl font-extrabold">₹0 <span className="text-sm font-normal text-muted-foreground">/ forever</span></div>
              <ul className="space-y-2.5 text-xs text-foreground/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 5 practice questions daily</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic PYQ library search</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard daily streaks</li>
              </ul>
            </div>
            <Link href="/auth" className="w-full py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/5 font-semibold text-center text-xs transition-colors">
              Sign Up Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="p-8 rounded-2xl border-2 border-primary bg-card flex flex-col justify-between space-y-6 relative shadow-lg">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
              Popular
            </span>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Premium Pro</h3>
              <p className="text-muted-foreground text-xs">Full access to tests, error-logging, and AI explanations.</p>
              <div className="text-3xl font-extrabold">₹199 <span className="text-sm font-normal text-muted-foreground">/ month</span></div>
              <ul className="space-y-2.5 text-xs text-foreground/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited MCQs & Mock Tests</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full Spaced Repetition flashcards</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited AI explanations & study plans</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Detailed weak-topic error tracking</li>
              </ul>
            </div>
            <Link href="/auth" className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-center text-xs transition-all btn-duo-primary">
              Unlock Pro Access
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="py-20 bg-secondary/15 border-t border-border px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 text-left font-semibold flex items-center justify-between text-sm transition-colors hover:bg-secondary/20"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/50 bg-secondary/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA / Footer */}
      <section className="py-20 border-t border-border text-center space-y-6 px-6">
        <h2 className="text-3xl font-extrabold">Ready to Crack Your Next Physio Exam?</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">Join thousands of physiotherapy aspirants drilling questions every single day.</p>
        <div className="pt-2">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-primary/30 btn-duo-primary"
          >
            Create Your Account Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-16 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PhysioPrep. Built for medical excellence. All rights reserved.
        </div>
      </section>
    </div>
  );
}
