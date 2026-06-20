"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Wallet,
  PieChart,
  Shield,
  Target,
  ChevronRight,
  Star,
  Zap,
  BarChart3,
  Brain,
  CheckCircle,
  Coffee,
  Car,
  CreditCard
} from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "UPI & Transaction Tracking",
    description: "Log every rupee across UPI, cards, and cash with smart categorization and real-time balance tracking.",
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Brain,
    title: "AI Financial Coach",
    description: "Get personalized insights, budget recommendations, and spending analysis powered by Gemini AI.",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: PieChart,
    title: "Smart Budgets",
    description: "Set category-level spending limits with real-time forecasting and over-budget alerts.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Target,
    title: "Savings Goals",
    description: "Create milestones, track contributions, and celebrate when you reach your financial targets.",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "End-to-end encrypted data with zero third-party access. Your finances stay yours.",
    color: "from-slate-600 to-slate-800",
    bgColor: "bg-slate-50",
  },
];

const STATS = [
  { value: "10,000+", label: "Active Users" },
  { value: "₹45Cr+", label: "Tracked Monthly" },
  { value: "4.9★", label: "User Rating" },
  { value: "99.9%", label: "Uptime" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Freelance Designer", text: "MoneyMap completely transformed how I manage my freelance income. The AI insights are incredibly helpful!", avatar: "PS" },
  { name: "Rahul Gupta", role: "Software Engineer", text: "Finally a finance app that understands Indian spending habits. The UPI tracking is seamless.", avatar: "RG" },
  { name: "Ananya Desai", role: "MBA Student", text: "The budget forecasting saved me from overspending three months in a row. Highly recommend!", avatar: "AD" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-page-bg text-text-primary overflow-x-hidden selection:bg-brand selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/dashboard" className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6">
        {/* Ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-bg border border-purple-100 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span className="text-xs font-bold text-brand">AI-Powered Personal Finance</span>
              </div>

              <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.1] tracking-tight">
                <span className="text-text-primary">Map Every Rupee.</span>
                <br />
                <span className="text-gradient-purple">Build Wealth.</span>
                <br />
                <span className="text-gradient-green">Live Better.</span>
              </h1>

              <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-lg">
                Your AI-powered finance companion for India. Track income, expenses, budgets, savings goals, and get real-time financial advice — all in one beautiful platform.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/dashboard"
                  className="btn-primary px-8 py-4 rounded-2xl text-base flex items-center gap-2 shadow-[0_8px_30px_rgba(124,58,237,0.3)]">
                  Start Mapping Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#features"
                  className="btn-secondary px-6 py-4 rounded-2xl text-base flex items-center gap-2">
                  See How It Works
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {["PS", "RG", "AD", "MK", "SV"].map((initials, i) => (
                    <div key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-light text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted font-medium mt-0.5">Trusted by 10,000+ Indians</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Premium Interactive Dashboard Mockup Showcase */}
            <motion.div 
              initial={{ opacity: 0, x: 45 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:block relative"
            >
              {/* Main shadow glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-brand/10 to-emerald-500/10 rounded-[32px] blur-3xl pointer-events-none" />

              {/* Main Dashboard Card */}
              <div className="relative card p-6 space-y-5 border-2 border-purple-100/50 shadow-float z-10 hover:shadow-xl transition-all duration-300">
                {/* Mock header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-text-muted font-medium">Good Morning</p>
                    <p className="text-lg font-bold text-text-primary tracking-tight">Sahil 👋</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-light text-white flex items-center justify-center text-xs font-extrabold border-2 border-white shadow-md">SV</div>
                </div>

                {/* Mock KPIs */}
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    { label: "Net Worth", value: "₹64,420", trend: "+12.4%", up: true },
                    { label: "Savings Rate", value: "67%", trend: "+4%", up: true },
                  ].map((kpi) => (
                    <div key={kpi.label} className="p-4 bg-page-bg rounded-2xl border border-border/80 space-y-1">
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{kpi.label}</p>
                      <p className="text-xl font-extrabold text-text-primary">{kpi.value}</p>
                      <span className={`inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${kpi.up ? "bg-green-50 text-accent-green" : "bg-red-50 text-accent-red"}`}>
                        {kpi.trend}
                      </span>
                    </div>
                  ))}
                </div>

                {/* SVG Area Chart */}
                <div className="h-32 bg-page-bg rounded-2xl border border-border/80 p-3.5 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-text-muted font-semibold uppercase">
                    <span>Cashflow (Income vs Expenses)</span>
                    <span className="text-brand font-bold">June 2026</span>
                  </div>
                  
                  {/* Real SVG Area Line Chart */}
                  <svg className="w-full h-20 mt-1" viewBox="0 0 300 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Fill */}
                    <path
                      d="M 0 80 Q 50 20 100 50 T 200 15 T 300 30 L 300 80 L 0 80 Z"
                      fill="url(#chartGlow)"
                    />
                    {/* Stroke */}
                    <path
                      d="M 0 80 Q 50 20 100 50 T 200 15 T 300 30"
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Highlight Dot */}
                    <circle cx="200" cy="15" r="4.5" fill="#7C3AED" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Mock AI insight */}
                <div className="p-3.5 bg-gradient-to-br from-[#F5F3FF] to-[#EEF2FF] rounded-2xl border border-purple-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-text-primary">Great job! 🎉</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">Food spending decreased by 12% this month.</p>
                  </div>
                </div>
              </div>

              {/* Overlapping Card 1: Floating Recent Activity */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -bottom-10 -left-8 w-64 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-float z-20 cursor-default"
              >
                <p className="text-xs font-bold text-text-primary mb-3">Recent Transactions</p>
                <div className="space-y-2.5">
                  {[
                    { icon: Coffee, name: "Starbucks Coffee", cost: "-₹280", tag: "Food", color: "text-amber-600 bg-amber-50" },
                    { icon: Car, name: "Uber Ride", cost: "-₹450", tag: "Travel", color: "text-blue-600 bg-blue-50" },
                    { icon: CreditCard, name: "Salary", cost: "+₹75,000", tag: "Income", color: "text-emerald-600 bg-emerald-50" },
                  ].map((tx, idx) => {
                    const TxIcon = tx.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${tx.color} flex items-center justify-center`}>
                            <TxIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-text-primary">{tx.name}</p>
                            <span className="text-[9px] text-text-muted">{tx.tag}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-extrabold ${tx.cost.startsWith("+") ? "text-accent-green" : "text-text-primary"}`}>
                          {tx.cost}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Overlapping Card 2: Savings Goal tracker */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-8 -right-8 w-56 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-float z-20 cursor-default"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                    <p className="text-[11px] font-bold text-text-primary">Savings Target</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-brand bg-brand-bg px-1.5 py-0.5 rounded-md">82%</span>
                </div>
                <p className="text-sm font-extrabold text-text-primary">MacBook Pro M4</p>
                <div className="w-full bg-border h-2 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-brand to-brand-light h-full rounded-full" style={{ width: "82%" }} />
                </div>
                <div className="flex justify-between items-center mt-2 text-[9px] text-text-muted font-bold">
                  <span>₹1,23,000 saved</span>
                  <span>Target: ₹1,50,000</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-secondary font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg border border-purple-100 rounded-full text-xs font-bold text-brand mb-4">
              <Zap className="w-3 h-3" /> Features
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
              Everything you need to master your money
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Powerful tools designed for the Indian financial ecosystem, powered by cutting-edge AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  onMouseEnter={() => setHoveredFeature(i)} onMouseLeave={() => setHoveredFeature(null)}
                  className="card p-7 space-y-4 card-lift cursor-default group">
                  <div className={`w-12 h-12 rounded-2xl ${feature.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6 text-text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-text-primary">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                  <div className="flex items-center gap-1 text-brand text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full text-xs font-bold text-accent-green mb-4">
              <BarChart3 className="w-3 h-3" /> How it Works
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
              Start in under 2 minutes
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign Up Free", desc: "Create your account in seconds. No credit card required.", icon: CheckCircle },
              { step: "02", title: "Log Transactions", desc: "Add expenses manually, via NLP, or connect your accounts.", icon: Wallet },
              { step: "03", title: "Get AI Insights", desc: "Receive personalized advice, budget alerts, and savings tips.", icon: Brain },
            ].map((item, i) => (
              <motion.div key={item.step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center space-y-4 p-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-bg border border-purple-100 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-brand" />
                </div>
                <div className="text-xs font-extrabold text-brand uppercase tracking-widest">Step {item.step}</div>
                <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
              Loved by thousands
            </h2>
            <p className="mt-4 text-lg text-text-secondary">See what our users are saying about MoneyMap.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card p-7 space-y-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-light text-white flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[28px] p-10 md:p-16 bg-gradient-to-br from-[#071B39] to-[#04142C] text-white text-center relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand/15 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready to take control of your finances?
              </h2>
              <p className="text-lg text-white/60 max-w-lg mx-auto">
                Join thousands of Indians who are already mapping every rupee and building wealth with AI-powered insights.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link href="/dashboard"
                  className="px-8 py-4 bg-white text-text-primary font-bold rounded-2xl text-base hover:bg-white/90 transition-all shadow-lg flex items-center gap-2">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login"
                  className="px-6 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl text-base hover:bg-white/20 transition-all">
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo iconClassName="w-7 h-7" textClassName="font-bold text-text-primary text-sm" />
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} MoneyMap. Map Every Rupee. Built with ❤️ for India.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Support"].map((link) => (
              <a key={link} href="#" className="text-xs text-text-muted hover:text-text-primary font-medium transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
