"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Lock,
  LineChart,
  Play,
  ArrowUpRight,
  Activity,
  Users
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Financial Coach",
    description: "Receive personalized wealth recommendations and spending insights powered by advanced AI models.",
    linkText: "Explore AI →",
  },
  {
    icon: Wallet,
    title: "Wealth Dashboard",
    description: "Consolidate and view all assets, cash reserves, and savings plans in one single, high-fidelity screen.",
    linkText: "See Dashboard →",
  },
  {
    icon: Activity,
    title: "Smart Insights",
    description: "Detect anomalies, optimize subscriptions, and unlock tax-saving allocation options automatically.",
    linkText: "Discover Insights →",
  },
  {
    icon: Target,
    title: "Goal Planning",
    description: "Build custom wealth milestones, model compounding growth, and track timelines with active forecasts.",
    linkText: "Plan Goals →",
  },
  {
    icon: LineChart,
    title: "Investment Visibility",
    description: "Log and track returns across mutual funds, stocks, fixed deposits, and cash in a single unified ledger.",
    linkText: "Track Growth →",
  },
  {
    icon: PieChart,
    title: "Cash Flow Intelligence",
    description: "Understand spending velocity and optimize daily liquidity with automated forecasting charts.",
    linkText: "See Intelligence →",
  },
];

const TRUST_ITEMS = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Your financial logs are encrypted locally and stored in sandbox isolation."
  },
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description: "Zero third-party integrations. Your financial life remains entirely your own."
  },
  {
    icon: Sparkles,
    title: "AI-Powered Wealth Intelligence",
    description: "Actionable recommendations that help you optimize yield over simple tracking."
  },
  {
    icon: Activity,
    title: "Reliable Infrastructure",
    description: "Built on a modern sandboxed database ensuring data integrity at scale."
  }
];

const STATS = [
  { value: "₹45Cr+", label: "Assets Under Intelligence" },
  { value: "10,000+", label: "Financial Journeys Guided" },
  { value: "4.9★", label: "User Satisfaction Score" },
  { value: "99.99%", label: "API & Sync Uptime" },
];

const TESTIMONIALS = [
  { 
    name: "Priya Sharma", 
    role: "Freelance Designer", 
    city: "Mumbai", 
    text: "Spreadsheets always felt like looking backward. MoneyMap's wealth intelligence shows me exactly where my cash flow is heading and how to optimize it." 
  },
  { 
    name: "Rohan Gupta", 
    role: "Software Engineer", 
    city: "Bangalore", 
    text: "Finally, a financial tool that understands the modern Indian investor. The AI recommendations alone saved me thousands in tax optimization." 
  },
  { 
    name: "Sneha Sen", 
    role: "Startup Founder", 
    city: "Pune", 
    text: "MoneyMap has given me the confidence to make major investment decisions with complete wealth visibility. The cash flow interface is beautiful." 
  },
];

const SHOWCASE_TABS = [
  {
    id: "networth",
    label: "Net Worth tracking",
    title: "Consolidated Wealth Visibility",
    desc: "Aggregate your cash flow, investments, and assets into a single visual ledger. Track long-term valuation shifts and compound rate growth dynamically.",
    metricValue: "₹64,42,000",
    metricLabel: "Active Assets Under Intelligence",
    chartColor: "#0057FF"
  },
  {
    id: "coach",
    label: "AI Wealth Coach",
    title: "Decisions Guided by Intelligence",
    desc: "Receive actionable advisories on high liquidity buffers, tax saving limits, and mutual fund shifts to maximize capital efficiency.",
    metricValue: "₹45,000",
    metricLabel: "Recommended Mutual Fund Allocation",
    chartColor: "#00D18F"
  },
  {
    id: "forecast",
    label: "Cash Flow Forecasting",
    title: "Model Your Compounding Future",
    desc: "Simulate cash flow curves 12 months out based on historic spending velocity, upcoming recurring transfers, and custom goals.",
    metricValue: "₹1,50,000",
    metricLabel: "Projected Liquidity for Q3",
    chartColor: "#D4AF37"
  }
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("networth");
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rX = -(mouseY / height) * 10;
    const rY = (mouseX / width) * 10;
    setTiltX(rX);
    setTiltY(rY);
  };

  const handleTiltLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  const activeTabContent = SHOWCASE_TABS.find((t) => t.id === activeTab) || SHOWCASE_TABS[0];

  return (
    <div className="min-h-screen bg-page-bg text-text-primary overflow-x-hidden selection:bg-brand selection:text-white font-sans">
      
      {/* Sticky Header Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo textClassName="font-bold text-lg tracking-tight text-text-primary" />
          </Link>

          {/* Menu items */}
          <div className="hidden md:flex items-center gap-8">
            {["Product", "Solutions", "Pricing", "Resources"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wider uppercase"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors uppercase tracking-wider">
              Sign In
            </Link>
            <Link href="/login?mode=signup" className="btn-primary px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 px-6">
        {/* Soft radial glow backing */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/3 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-8">
              {/* Badge tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F0F4FF] border border-[#0057FF]/10 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-brand fill-brand/10" />
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Built For Modern Indian Wealth</span>
              </div>

              <h1 className="text-4xl md:text-[54px] font-extrabold leading-[1.1] tracking-tight text-text-primary">
                One Place To Understand <br />
                <span className="bg-gradient-to-r from-brand via-[#2563EB] to-[#00D18F] bg-clip-text text-transparent">
                  Your Entire Financial Life.
                </span>
              </h1>

              <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-xl font-medium">
                MoneyMap integrates wealth intelligence, cash flow forecasting, investment tracking, and AI-powered recommendations into a single, cohesive financial command center for ambitious professionals.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  href="/login?mode=signup"
                  className="btn-primary px-8 py-4 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="#showcase"
                  className="btn-secondary px-6 py-4 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 border border-border bg-white"
                >
                  <Play className="w-4 h-4 fill-text-primary text-text-primary" /> Watch Demo
                </Link>
              </div>

              {/* Social Proof metrics */}
              <div className="pt-6 border-t border-border/80 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {["PS", "RG", "AD", "MK"].map((initials, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-brand-light text-white flex items-center justify-center text-[9px] font-extrabold border-2 border-white shadow-sm">
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-text-secondary font-bold">Trusted by 10,000+ ambitious users in India</p>
                </div>
              </div>
            </div>

            {/* Hero Right Mockup with 3D Parallax Tilt */}
            <div className="lg:col-span-6 hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, x: 30, rotateX: 0, rotateY: 0 }} 
                animate={{ opacity: 1, x: 0, rotateX: tiltX, rotateY: tiltY }} 
                transition={{
                  x: { duration: 0.8, ease: "easeOut", delay: 0.1 },
                  opacity: { duration: 0.8, ease: "easeOut", delay: 0.1 },
                  rotateX: { type: "spring", stiffness: 220, damping: 22 },
                  rotateY: { type: "spring", stiffness: 220, damping: 22 }
                }}
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
                style={{ transformStyle: "preserve-3d", perspective: 1200 }}
                className="relative cursor-pointer"
              >
                {/* Visual glow backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-br from-brand/5 to-accent-green/5 rounded-[32px] blur-3xl pointer-events-none" />

                {/* Main Dashboard Card */}
                <div 
                  style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
                  className="relative card p-6 space-y-5 border border-border shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Financial Intelligence Command</p>
                      <p className="text-lg font-extrabold text-text-primary tracking-tight mt-0.5">Good Morning, Sahil 👋</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center text-xs font-extrabold shadow-md">SV</div>
                  </div>

                  {/* Net Worth KPIs */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-4 bg-page-bg rounded-2xl border border-border/60">
                      <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">Net Worth</p>
                      <p className="text-xl font-extrabold text-text-primary mt-1">₹64,42,000</p>
                      <span className="inline-block text-[9px] font-bold text-accent-green bg-green-50 px-1.5 py-0.5 rounded-md mt-1.5">+12.4% this year</span>
                    </div>
                    <div className="p-4 bg-page-bg rounded-2xl border border-border/60">
                      <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">Savings Velocity</p>
                      <p className="text-xl font-extrabold text-text-primary mt-1">67%</p>
                      <span className="inline-block text-[9px] font-bold text-[#D4AF37] bg-amber-50 px-1.5 py-0.5 rounded-md mt-1.5">Top 5% efficiency</span>
                    </div>
                  </div>

                  {/* Area Chart Vector */}
                  <div className="h-28 bg-page-bg rounded-2xl border border-border/60 p-3.5 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between text-[9px] text-text-muted font-bold uppercase tracking-wider">
                      <span>Liquidity Curve (Income vs Spend)</span>
                      <span className="text-brand">Compounding</span>
                    </div>
                    <svg className="w-full h-14 mt-1" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="glowBrand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0057FF" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#0057FF" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 80 Q 50 15 100 45 T 200 10 T 300 20 L 300 80 L 0 80 Z" fill="url(#glowBrand)" />
                      <path d="M 0 80 Q 50 15 100 45 T 200 10 T 300 20" fill="none" stroke="#0057FF" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="200" cy="10" r="4.5" fill="#00D18F" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Advisor Insight */}
                  <div className="p-3.5 bg-gradient-to-br from-[#F0F4FF] to-white rounded-2xl border border-[#0057FF]/10 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-text-primary">Wealth Advisory Alert</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">High liquidity detected. Relocate ₹45,000 to Mutual Funds to maintain 14.2% projected yield.</p>
                    </div>
                  </div>
                </div>

                {/* Overlapping Card 1: Floating Activity (left bottom) */}
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
                  className="absolute -bottom-8 -left-8 w-60 bg-white p-4 rounded-2xl border border-border shadow-lg z-20 cursor-default"
                >
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2.5">Asset Movements</p>
                  <div className="space-y-2">
                    {[
                      { label: "Salary Allocation", amt: "+₹1,50,000", color: "text-accent-green" },
                      { label: "Equity Investments", amt: "-₹35,000", color: "text-text-primary" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-text-secondary">{item.label}</span>
                        <span className={`font-bold ${item.color}`}>{item.amt}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Overlapping Card 2: Savings Goal (right top) */}
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
                  className="absolute -top-8 -right-8 w-56 bg-white p-4 rounded-2xl border border-border shadow-lg z-20 cursor-default"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Goal Milestone</span>
                    <span className="text-[9px] font-extrabold text-[#D4AF37] bg-amber-50 px-1.5 py-0.5 rounded">82%</span>
                  </div>
                  <p className="text-xs font-bold text-text-primary">Emergency Reserve Fund</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-[#D4AF37] h-full rounded-full" style={{ width: "82%" }} />
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Infrastructure Section */}
      <section className="py-20 border-t border-border bg-[#FAFAF8] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-text-muted uppercase">Security & Verification</h2>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-text-primary mt-2">
              Trusted by Ambitious Indians to Build Wealth Smarter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-3 bg-white p-6 rounded-2xl border border-border/70 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary tracking-tight">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Large Statistics Section */}
      <section className="py-20 border-y border-border bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <p className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="product" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F4FF] border border-[#0057FF]/10 rounded-full text-[10px] font-bold text-brand uppercase tracking-wider">
              <Zap className="w-3 h-3 text-brand" /> Wealth Intelligence
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
              Designed to Control Your Financial Future
            </h2>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-medium">
              Every detail is engineered to optimize cash flow, track growth, and make intelligent wealth decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title} 
                  className="card p-8 space-y-5 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                      <Icon className="w-6 h-6 text-brand" />
                    </div>
                    <h3 className="text-base font-bold text-text-primary tracking-tight">{feature.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand group-hover:underline">
                      {feature.linkText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Showcase Section */}
      <section id="showcase" className="py-24 md:py-32 bg-[#FAFAF8] border-y border-border px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Showcase</h2>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              The Command Center in Action
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Selection Tabs */}
            <div className="lg:col-span-4 space-y-3.5">
              {SHOWCASE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white border-border shadow-md"
                      : "bg-transparent border-transparent hover:bg-white/40"
                  }`}
                >
                  <p className={`text-xs font-bold uppercase tracking-wider ${activeTab === tab.id ? "text-brand" : "text-text-muted"}`}>
                    {tab.label}
                  </p>
                  <p className="text-sm font-bold text-text-primary mt-1.5">{tab.title}</p>
                </button>
              ))}
            </div>

            {/* Right Active Visualization View */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabContent.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 rounded-[24px] border border-border shadow-lg space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-text-primary">{activeTabContent.title}</h4>
                      <p className="text-xs text-text-secondary mt-1 max-w-md leading-relaxed">{activeTabContent.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">{activeTabContent.metricLabel}</p>
                      <p className="text-xl font-extrabold text-text-primary mt-0.5">{activeTabContent.metricValue}</p>
                    </div>
                  </div>

                  {/* Rendering specific mock visualizations */}
                  <div className="h-60 bg-[#FAFAF8] rounded-2xl border border-border/80 p-5 flex flex-col justify-between overflow-hidden relative">
                    {activeTabContent.id === "networth" && (
                      <>
                        <div className="flex justify-between items-center text-[10px] text-text-secondary font-bold">
                          <span>Q1 2026</span>
                          <span>Q2 2026</span>
                          <span>Q3 2026</span>
                        </div>
                        {/* Realistic step area chart SVG */}
                        <svg className="w-full h-32 mt-4" viewBox="0 0 500 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0057FF" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#0057FF" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M 0 100 Q 100 80 200 60 T 400 30 T 500 10 L 500 100 Z" fill="url(#nwGrad)" />
                          <path d="M 0 100 Q 100 80 200 60 T 400 30 T 500 10" fill="none" stroke="#0057FF" strokeWidth="3" />
                          <circle cx="500" cy="10" r="5" fill="#00D18F" stroke="white" strokeWidth="2" />
                        </svg>
                      </>
                    )}

                    {activeTabContent.id === "coach" && (
                      <div className="h-full flex flex-col justify-center space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border/80 shadow-sm">
                          <Sparkles className="w-5 h-5 text-brand shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-text-primary">Mutual Fund Optimization Opportunity</p>
                            <p className="text-[11px] text-text-secondary mt-0.5">Move ₹45,000 cash balance. Estimated compounding yield increase: +₹6,390/yr.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border/80 shadow-sm opacity-70">
                          <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37] shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-text-primary">Recurring Subscription Detection</p>
                            <p className="text-[11px] text-text-secondary mt-0.5">Identify 2 overlapping hosting bills. Cancel option available to unlock savings.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTabContent.id === "forecast" && (
                      <>
                        <div className="flex justify-between items-center text-[10px] text-text-secondary font-bold">
                          <span>Current</span>
                          <span>+3 Months</span>
                          <span>+6 Months</span>
                          <span>+12 Months (Forecast)</span>
                        </div>
                        {/* Dotted forecast visualization SVG */}
                        <svg className="w-full h-32 mt-4" viewBox="0 0 500 100" preserveAspectRatio="none">
                          <path d="M 0 80 L 150 70 L 300 62" fill="none" stroke="#0057FF" strokeWidth="2.5" />
                          <path d="M 300 62 Q 400 40 500 20" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="5 5" />
                          <circle cx="300" cy="62" r="4" fill="#0057FF" />
                          <circle cx="500" cy="20" r="5" fill="#D4AF37" />
                        </svg>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="solutions" className="py-24 md:py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-2">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Testimonials</h2>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              Trusted by Ambitious Professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="card p-8 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
                <p className="text-xs md:text-sm text-text-secondary italic leading-relaxed font-medium">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/80">
                  <div className="w-9 h-9 rounded-full bg-brand-bg text-brand flex items-center justify-center font-bold text-xs uppercase">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">{testimonial.name}</h4>
                    <p className="text-[10px] text-text-muted mt-0.5">{testimonial.role} · {testimonial.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value-Driven Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-[#FAFAF8] border-t border-border px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Pricing</span>
            <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
              Invest in Your Financial Clarity
            </p>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-semibold uppercase tracking-wider">
              No advertising. No data selling. Pure wealth optimization value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Sandbox Starter plan */}
            <div className="bg-white p-8 rounded-[24px] border border-border shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Sandbox Free</p>
                <h3 className="text-2xl font-extrabold text-text-primary">Starter</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Basic sandbox ledger access to track cash flow and log accounts manually without automated advice.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2">✓ Manual transaction ledger</li>
                  <li className="flex items-center gap-2">✓ Default category budgets</li>
                  <li className="flex items-center gap-2">✓ Sandbox data isolation</li>
                </ul>
              </div>
              <Link 
                href="/login?mode=signup" 
                className="w-full text-center py-3 btn-secondary border border-border rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-slate-50 transition-colors block"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro wealth intelligence plan */}
            <div className="bg-white p-8 rounded-[24px] border-2 border-brand shadow-md flex flex-col justify-between space-y-8 relative overflow-hidden">
              {/* Gold border banner */}
              <div className="absolute top-0 right-0 bg-brand text-white px-3 py-1 text-[8px] font-extrabold uppercase tracking-widest rounded-bl-lg">
                Recommended
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-wider">Premium intelligence</p>
                  <span className="text-[8px] font-bold text-[#D4AF37] bg-amber-50 px-1.5 py-0.5 rounded border border-[#D4AF37]/20 uppercase">Pro</span>
                </div>
                <h3 className="text-2xl font-extrabold text-text-primary flex items-baseline gap-1">
                  ₹299 <span className="text-xs font-medium text-text-secondary">/ month</span>
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Unlock advanced AI coaches, predictive cash flow mapping, tax recommendations, and high-fidelity target forecast curves.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2 text-brand">✓ AI Financial Coach & suggestions</li>
                  <li className="flex items-center gap-2">✓ Predictive cash flow forecasting</li>
                  <li className="flex items-center gap-2">✓ Custom investment category mapping</li>
                  <li className="flex items-center gap-2 text-[#D4AF37]">✓ Premium goal milestone analytics</li>
                  <li className="flex items-center gap-2">✓ Priority infrastructure sync speeds</li>
                </ul>
              </div>
              <Link 
                href="/login?mode=signup" 
                className="w-full text-center py-3 btn-primary rounded-xl text-xs uppercase tracking-wider font-bold shadow-md block"
              >
                Upgrade to Intelligence
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Conversion Block */}
      <section id="resources" className="py-24 md:py-32 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[28px] p-10 md:p-16 bg-gradient-to-br from-[#0B132B] to-[#070B19] text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand/10 rounded-full blur-[110px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Ready to Command Your Financial Future?
              </h2>
              <p className="text-sm md:text-base text-white/60 max-w-lg mx-auto leading-relaxed">
                Join wealth-conscious Indian professional families, founders, and investors optimizing cash flow efficiency in one unified workspace.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                <Link 
                  href="/login?mode=signup"
                  className="px-8 py-4 bg-white text-text-primary font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-md flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-4 h-4 text-text-primary" />
                </Link>
                <Link 
                  href="/login"
                  className="px-6 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-xs uppercase tracking-widest hover:bg-white/15 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Logo showText={true} iconClassName="w-8 h-8" textClassName="font-extrabold text-sm tracking-tight text-text-primary" />
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
              The Financial Operating System for Modern India. Optimize cash flow, aggregate asset records, and leverage wealth intelligence.
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              {
                title: "Product",
                links: ["AI Coach", "Analytics Dashboard", "Goal Forecasts", "Pricing"]
              },
              {
                title: "Solutions",
                links: ["For Professionals", "For Founders", "Investment Sync", "Wealth Planning"]
              },
              {
                title: "Resources",
                links: ["API Docs", "Security Sandbox", "Support Desk", "Privacy Policy"]
              },
              {
                title: "Company",
                links: ["About Platform", "Brand Security", "Client Terms", "Contact Info"]
              }
            ].map((section, idx) => (
              <div key={idx} className="space-y-3.5">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-text-secondary hover:text-text-primary font-semibold transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright block */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
            © 2026 MoneyMap. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Security Sandbox", "Privacy Policy", "Terms of Use"].map((item) => (
              <a key={item} href="#" className="text-[10px] text-text-muted hover:text-text-primary font-semibold uppercase tracking-wider transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
