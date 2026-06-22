"use client";

import React, { useState, useEffect } from "react";
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
  Lock,
  LineChart,
  Play,
  ArrowUpRight,
  Activity
} from "lucide-react";

const SHOWCASE_TABS = [
  {
    id: "networth",
    label: "Consolidated Wealth",
    title: "All assets in one place",
    desc: "Aggregate your savings accounts, mutual funds, gold, and properties into a single financial ledger. Track long-term valuation shifts and net growth without third-party sync risk.",
    metricValue: "₹64,42,000",
    metricLabel: "Consolidated Net Worth",
  },
  {
    id: "spending",
    label: "Spending Analysis",
    title: "Understand cash velocity",
    desc: "Categorize monthly expenses automatically and track your true burn rate. See where capital leaks occur and establish realistic boundaries for recurring categories.",
    metricValue: "₹48,250",
    metricLabel: "Average Monthly Burn",
  },
  {
    id: "forecast",
    label: "Savings Projections",
    title: "Model your compounding future",
    desc: "Simulate cash flow curves 12 months out based on historic savings rates, upcoming recurring transfers, and custom milestones. See the impact of compounding over the long term.",
    metricValue: "₹1,50,000",
    metricLabel: "Projected Q3 Savings Target",
  }
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("networth");
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("moneymap_user");
        if (saved) {
          try {
            setCurrentUser(JSON.parse(saved));
          } catch (e) {}
        } else {
          setCurrentUser(null);
        }
      }
    };
    checkUser();
    window.addEventListener("moneymap_auth_change", checkUser);
    return () => window.removeEventListener("moneymap_auth_change", checkUser);
  }, []);

  const activeTabContent = SHOWCASE_TABS.find((t) => t.id === activeTab) || SHOWCASE_TABS[0];

  return (
    <div className="min-h-screen bg-page-bg text-text-primary overflow-x-hidden selection:bg-brand selection:text-white font-sans">
      
      {/* Navigation Header */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-page-bg/85 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo textClassName="font-semibold text-base tracking-tight text-[#111111]" />
          </Link>

          {/* Minimal Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#product" className="text-xs font-medium text-text-secondary hover:text-[#111111] transition-colors tracking-wide">Product</a>
            <a href="#features" className="text-xs font-medium text-text-secondary hover:text-[#111111] transition-colors tracking-wide">Features</a>
            <a href="#pricing" className="text-xs font-medium text-text-secondary hover:text-[#111111] transition-colors tracking-wide">Pricing</a>
            <a href="#about" className="text-xs font-medium text-text-secondary hover:text-[#111111] transition-colors tracking-wide">About</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link href="/dashboard" className="text-xs font-semibold text-text-secondary hover:text-[#111111] transition-colors">
                  Go to Dashboard
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem("moneymap_user");
                    window.dispatchEvent(new Event("moneymap_auth_change"));
                  }}
                  className="btn-secondary px-4 py-2 text-xs font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-xs font-semibold text-text-secondary hover:text-[#111111] transition-colors">
                  Sign In
                </Link>
                <Link href="/login?mode=signup" className="btn-primary px-4 py-2 text-xs font-semibold">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="product" className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-brand uppercase tracking-wider block">
                Financial Clarity For Modern India
              </span>
              
              <h1 className="text-4xl md:text-[50px] font-extrabold leading-[1.08] tracking-tight text-[#111111]">
                Understand <br className="hidden md:inline" /> Every Rupee.
              </h1>
              
              <p className="text-base text-text-secondary leading-relaxed max-w-md font-normal">
                MoneyMap brings together your spending, savings, investments, and net worth into one precise view. Built for individuals seeking clarity and long-term control over their wealth.
              </p>

              <div className="flex items-center gap-3 pt-2">
                {currentUser ? (
                  <Link href="/dashboard" className="btn-primary px-6 py-3 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <>
                    <Link href="/login?mode=signup" className="btn-primary px-6 py-3 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      Get Started Free <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a href="#showcase" className="btn-secondary px-5 py-3 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-text-primary text-text-primary" /> See How It Works
                    </a>
                  </>
                )}
              </div>
              
              <p className="text-[11px] text-text-muted font-medium pt-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand" /> Private sandboxed local storage. No data selling.
              </p>
            </div>

            {/* Right Product Mockup Column */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
                {/* Browser bar */}
                <div className="bg-[#F3F4F6]/50 border-b border-border/80 px-4 py-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                  <div className="h-5 w-40 bg-white rounded border border-border/40 text-[9px] text-text-muted flex items-center justify-center mx-auto tracking-wide font-mono select-none">
                    moneymap.in/dashboard
                  </div>
                </div>
                
                {/* Simulated Dashboard content */}
                <div className="p-6 space-y-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Financial Overview</p>
                      <p className="text-base font-bold text-[#111111] mt-0.5">Good Morning, Sahil</p>
                    </div>
                    <span className="text-[10px] font-bold text-accent-green bg-green-50 px-2 py-0.5 rounded border border-green-100">Live Ledger</span>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-page-bg rounded-lg border border-border/60">
                      <p className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider">Net Worth</p>
                      <p className="text-lg font-bold text-[#111111] mt-1">₹64,42,000</p>
                      <span className="text-[9px] text-accent-green font-medium">+12.4%</span>
                    </div>
                    <div className="p-4 bg-page-bg rounded-lg border border-border/60">
                      <p className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider">Monthly Expenses</p>
                      <p className="text-lg font-bold text-[#111111] mt-1">₹48,250</p>
                      <span className="text-[9px] text-accent-red font-medium">-5.1%</span>
                    </div>
                    <div className="p-4 bg-page-bg rounded-lg border border-border/60">
                      <p className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider">Savings Rate</p>
                      <p className="text-lg font-bold text-[#111111] mt-1">67%</p>
                      <span className="text-[9px] text-[#0F62FE] font-medium">Optimal</span>
                    </div>
                  </div>

                  {/* Cash Flow Line Chart Vector */}
                  <div className="h-28 bg-page-bg rounded-lg border border-border/60 p-4 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between text-[9px] text-text-muted font-semibold">
                      <span>MONTHLY INCOME VS SPENDING TREND</span>
                      <span className="text-[#0F62FE] font-bold">SAVINGS TARGET ACTIVE</span>
                    </div>
                    <svg className="w-full h-12 mt-1" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <path d="M 0 65 Q 50 15 100 45 T 200 10 T 300 20" fill="none" stroke="#0F62FE" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="200" cy="10" r="3.5" fill="#059669" stroke="white" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Editorial Trust Columns */}
      <section className="py-12 bg-white border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand" /> End-to-End Local Encryption
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your financial transaction data remains sandboxed. We encrypt configurations locally with zero third-party leakage.
            </p>
          </div>
          <div className="space-y-2 md:border-l md:border-border/60 md:pl-8">
            <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand" /> Privacy-First Architecture
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              No advertising models, no spam calls, and no selling of user profiles. The product is sustained by honest, clear subscriptions.
            </p>
          </div>
          <div className="space-y-2 md:border-l md:border-border/60 md:pl-8">
            <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand" /> Honest Ledger Logic
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Transactions, categories, and forecasts are calculated transparently using solid mathematical models for actual clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Asymmetrical Custom Features Section */}
      <section id="features" className="py-24 space-y-32 max-w-7xl mx-auto px-6">
        
        {/* Feature 1: Left Text, Right Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[10px] font-bold text-brand uppercase tracking-wider">Product Features</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111]">
              Consolidated Financial Overview
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Aggregate balances, accounts, and history in one visual workspace. Clear tables let you inspect cash registers, equity allocations, and bank reserves with precision.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Asset Allocation Ledger</p>
              <div className="space-y-2">
                {[
                  { name: "Emergency Bank Deposit", type: "Liquid Cash", val: "₹4,50,000", pct: "7%" },
                  { name: "Nifty Index Fund", type: "Equities", val: "₹38,20,000", pct: "59%" },
                  { name: "Physical Gold Vault", type: "Commodities", val: "₹12,80,000", pct: "20%" },
                  { name: "Fixed Term Bonds", type: "Debt Asset", val: "₹8,92,000", pct: "14%" },
                ].map((asset, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-border/50 text-xs">
                    <div>
                      <p className="font-semibold text-[#111111]">{asset.name}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{asset.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#111111]">{asset.val}</p>
                      <p className="text-[9px] text-[#0F62FE] font-medium mt-0.5">{asset.pct} total weight</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Right Text, Left Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Monthly Category Limits</p>
              <div className="space-y-4">
                {[
                  { name: "Residential Rent", spent: "₹22,000", limit: "₹22,000", fill: "w-full", color: "bg-brand" },
                  { name: "Household Groceries & Food", spent: "₹8,450", limit: "₹15,000", fill: "w-[56%]", color: "bg-[#059669]" },
                  { name: "Utilities & Fuel", spent: "₹4,120", limit: "₹8,000", fill: "w-[51%]", color: "bg-[#059669]" },
                  { name: "Leisure & Travel", spent: "₹6,800", limit: "₹6,000", fill: "w-full", color: "bg-accent-red" },
                ].map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-secondary">{cat.name}</span>
                      <span className="text-[#111111]">{cat.spent} / {cat.limit}</span>
                    </div>
                    <div className="h-2 bg-page-bg rounded-full overflow-hidden">
                      <div className={`h-full ${cat.fill} ${cat.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <p className="text-[10px] font-bold text-brand uppercase tracking-wider">Expense Controls</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111]">
              Understand Spending Velocity
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Track category averages, trace leaks, and allocate exact spending thresholds. Build realistic budget bounds so you stay inside your monthly targets comfortably.
            </p>
          </div>
        </div>

        {/* Feature 3: Left Text, Right Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[10px] font-bold text-brand uppercase tracking-wider">Milestones</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111]">
              Compounding Goal Tracks
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Establish concrete savings goals and model their development. Visual milestone metrics show you how consistent allocations compound over months and quarters.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Milestone Projections</p>
                <span className="text-xs font-semibold text-[#111111]">2 Active Goals</span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-page-bg rounded-lg border border-border/50">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-[#111111]">Emergency Reserve (6 Months)</span>
                    <span className="text-[#059669]">82% Complete</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-text-muted mb-1.5">
                    <span>Saved: ₹2,46,000</span>
                    <span>Target: ₹3,00,000</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden border border-border/30">
                    <div className="h-full w-[82%] bg-[#059669]" />
                  </div>
                </div>

                <div className="p-4 bg-page-bg rounded-lg border border-border/50">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-[#111111]">New Work Station</span>
                    <span className="text-brand">40% Complete</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-text-muted mb-1.5">
                    <span>Saved: ₹80,000</span>
                    <span>Target: ₹2,00,000</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden border border-border/30">
                    <div className="h-full w-[40%] bg-brand" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Product Showcase tab bar */}
      <section id="showcase" className="py-24 bg-white border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Interactive Showcase</h2>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111]">
              Clarity in Action
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Selection Tabs */}
            <div className="lg:col-span-4 space-y-2">
              {SHOWCASE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-5 rounded-lg border transition-all ${
                    activeTab === tab.id
                      ? "bg-page-bg border-border"
                      : "bg-transparent border-transparent hover:bg-page-bg/40"
                  }`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === tab.id ? "text-brand" : "text-text-muted"}`}>
                    {tab.label}
                  </p>
                  <p className="text-sm font-bold text-[#111111] mt-1">{tab.title}</p>
                </button>
              ))}
            </div>

            {/* Right Active Visualization */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabContent.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-page-bg p-8 rounded-xl border border-border space-y-6"
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <h4 className="text-base font-bold text-[#111111]">{activeTabContent.title}</h4>
                      <p className="text-xs text-text-secondary mt-1 max-w-md leading-relaxed">{activeTabContent.desc}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">{activeTabContent.metricLabel}</p>
                      <p className="text-xl font-bold text-[#111111] mt-0.5">{activeTabContent.metricValue}</p>
                    </div>
                  </div>

                  <div className="h-60 bg-white rounded-lg border border-border p-5 flex flex-col justify-between overflow-hidden relative">
                    {activeTabContent.id === "networth" && (
                      <>
                        <div className="flex justify-between items-center text-[10px] text-text-muted font-semibold">
                          <span>Q1 2026</span>
                          <span>Q2 2026</span>
                          <span>Q3 2026 (Consolidated Balance)</span>
                        </div>
                        <svg className="w-full h-32 mt-4" viewBox="0 0 500 100" preserveAspectRatio="none">
                          <path d="M 0 100 Q 100 80 200 60 T 400 30 T 500 12 L 500 100 Z" fill="#F0F4FF" />
                          <path d="M 0 100 Q 100 80 200 60 T 400 30 T 500 12" fill="none" stroke="#0F62FE" strokeWidth="2" />
                          <circle cx="500" cy="12" r="4.5" fill="#059669" stroke="white" strokeWidth="1.5" />
                        </svg>
                      </>
                    )}

                    {activeTabContent.id === "spending" && (
                      <div className="h-full flex flex-col justify-center space-y-4">
                        <div className="flex items-center justify-between p-3.5 bg-page-bg rounded-lg border border-border/80 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-blue-50 text-[#0F62FE] flex items-center justify-center rounded">🏠</span>
                            <div>
                              <p className="font-bold text-[#111111]">Residential Rent Transfer</p>
                              <p className="text-[10px] text-text-muted mt-0.5">Recurring Category limit active</p>
                            </div>
                          </div>
                          <span className="font-bold text-accent-red">-₹22,000</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 bg-page-bg rounded-lg border border-border/80 text-xs opacity-75">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-emerald-50 text-[#059669] flex items-center justify-center rounded">🛍️</span>
                            <div>
                              <p className="font-bold text-[#111111]">Daily Shopping Store</p>
                              <p className="text-[10px] text-text-muted mt-0.5">Discretionary charge log</p>
                            </div>
                          </div>
                          <span className="font-bold text-accent-red">-₹3,850</span>
                        </div>
                      </div>
                    )}

                    {activeTabContent.id === "forecast" && (
                      <>
                        <div className="flex justify-between items-center text-[10px] text-text-muted font-semibold">
                          <span>Current Target</span>
                          <span>+6 Months Projection</span>
                          <span>+12 Months (Compound curve)</span>
                        </div>
                        <svg className="w-full h-32 mt-4" viewBox="0 0 500 100" preserveAspectRatio="none">
                          <path d="M 0 80 L 150 70 L 300 62" fill="none" stroke="#6B7280" strokeWidth="1.5" />
                          <path d="M 300 62 Q 400 40 500 20" fill="none" stroke="#0F62FE" strokeWidth="2.5" strokeDasharray="4 4" />
                          <circle cx="300" cy="62" r="3.5" fill="#6B7280" />
                          <circle cx="500" cy="20" r="4.5" fill="#0F62FE" />
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

      {/* Real Testimonial (Restrained) */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center space-y-8">
        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">USER NOTE</span>
        <blockquote className="max-w-2xl mx-auto">
          <p className="text-lg md:text-xl font-medium text-[#111111] leading-relaxed italic">
            &ldquo;MoneyMap has replaced three separate spreadsheets for me. Having my net worth calculation, monthly budgets, and multi-month savings forecasts in a secure, local sandbox provides actual peace of mind.&rdquo;
          </p>
        </blockquote>
        <div>
          <cite className="text-xs font-bold text-[#111111] not-italic block uppercase tracking-wider">— Rohan Gupta</cite>
          <span className="text-[10px] text-text-secondary">Software Engineer · Bangalore</span>
        </div>
      </section>

      {/* Simple Pricing Section */}
      <section id="pricing" className="py-24 bg-page-bg border-t border-border px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Pricing</span>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] leading-tight">
              Invest in Your Financial Clarity
            </p>
            <p className="text-xs text-text-secondary leading-relaxed font-semibold uppercase tracking-wider">
              No advertising. No spam. Simply tracking and metrics value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-lg border border-border shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Sandbox Free</p>
                <h3 className="text-xl font-bold text-[#111111]">Starter</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Basic ledger access to track your cash flow and log transactions manually in local storage.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">✓ Manual transaction ledger</li>
                  <li className="flex items-center gap-2">✓ Category-based budgets</li>
                  <li className="flex items-center gap-2">✓ Sandbox data isolation</li>
                </ul>
              </div>
              {currentUser ? (
                <Link href="/dashboard" className="w-full text-center py-2.5 btn-secondary text-xs uppercase tracking-wider font-semibold block">
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/login?mode=signup" className="w-full text-center py-2.5 btn-secondary text-xs uppercase tracking-wider font-semibold block">
                  Sign Up Free
                </Link>
              )}
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-lg border border-[#0F62FE] shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-wider">Premium Account</p>
                  <span className="text-[8px] font-bold text-[#0F62FE] bg-blue-50 px-2 py-0.5 rounded border border-[#0F62FE]/10 uppercase">Pro</span>
                </div>
                <h3 className="text-xl font-bold text-[#111111] flex items-baseline gap-1">
                  ₹299 <span className="text-xs font-normal text-text-secondary">/ month</span>
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Unlock advanced forecasting curves, custom category ledgers, recurring calculations, and priority report generation.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs text-text-secondary">
                  <li className="flex items-center gap-2 text-[#0F62FE]">✓ Active savings forecasting curves</li>
                  <li className="flex items-center gap-2">✓ Custom investment ledgers</li>
                  <li className="flex items-center gap-2">✓ Category limit warnings</li>
                  <li className="flex items-center gap-2">✓ Automated recurring schedules</li>
                  <li className="flex items-center gap-2">✓ Exportable Excel/CSV sheets</li>
                </ul>
              </div>
              {currentUser ? (
                <Link href="/dashboard" className="w-full text-center py-2.5 btn-primary text-xs uppercase tracking-wider font-semibold block">
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/login?mode=signup" className="w-full text-center py-2.5 btn-primary text-xs uppercase tracking-wider font-semibold block">
                  Upgrade Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA conversion block */}
      <section id="about" className="py-24 bg-white border-t border-border px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111]">
            Ready to Understand Your Money?
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Join the wealth-conscious professionals managing cash registers and savings targets in sandbox isolation.
          </p>
          <div className="pt-4">
            {currentUser ? (
              <Link href="/dashboard" className="btn-primary px-8 py-3 text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-1.5">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/login?mode=signup" className="btn-primary px-6 py-3 text-xs uppercase tracking-wider font-semibold">
                  Get Started Free
                </Link>
                <Link href="/login" className="btn-secondary px-6 py-3 text-xs uppercase tracking-wider font-semibold">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-16 px-6 border-t border-border bg-page-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-3">
            <Logo showText={true} iconClassName="w-8 h-8" textClassName="font-semibold text-sm tracking-tight text-[#111111]" />
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
              Understand every rupee. A mature financial operating system to log balances, track categories, and forecast savings.
            </p>
          </div>

          {/* Links Column */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Product",
                links: ["Ledger Overview", "Expenses Analysis", "Milestone Goals", "Pricing Plan"]
              },
              {
                title: "Resources",
                links: ["Security Sandbox", "Client Agreement", "Privacy Protocol", "Contact Desk"]
              },
              {
                title: "Company",
                links: ["About Platform", "Platform Standards", "Support Center", "Terms of Use"]
              }
            ].map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-text-secondary hover:text-[#111111] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-text-secondary font-medium">
            © 2026 MoneyMap. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Sandbox Security", "Privacy Policy", "Terms of Use"].map((item) => (
              <a key={item} href="#" className="text-[10px] text-text-secondary hover:text-[#111111] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
