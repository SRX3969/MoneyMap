"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "@/types";
import { useDashboard } from "@/context/dashboard-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Target,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from "recharts";

const PIE_COLORS = ["#7C3AED", "#10B981", "#F59E0B", "#2563EB", "#EC4899", "#64748B"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function Dashboard() {
  const router = useRouter();
  const { setAddTransactionOpen, setAiAssistantOpen } = useDashboard();
  const dashboardData = useQuery(api.transactions.getDashboardSummary);
  const transactions = useQuery(api.transactions.list, {}) || [];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!dashboardData) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Skeleton loading */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-32 animate-shimmer rounded-lg" />
            <div className="h-8 w-64 animate-shimmer rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-shimmer rounded-[20px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="h-72 animate-shimmer rounded-[20px] lg:col-span-2" />
          <div className="h-72 animate-shimmer rounded-[20px]" />
        </div>
      </div>
    );
  }

  const { currentBalance, totalIncome, totalExpense, totalSavings, budgetUtilization, recentTransactions } = dashboardData;

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Build trend chart data from recent transactions
  const getTrendData = () => {
    const monthMap: Record<string, { name: string; Income: number; Expense: number }> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = months[d.getMonth()];
      if (!monthMap[key]) monthMap[key] = { name: key, Income: 0, Expense: 0 };
      if (t.type === "income") monthMap[key].Income += t.amount;
      else monthMap[key].Expense += t.amount;
    });

    return months
      .filter((m) => monthMap[m])
      .map((m) => monthMap[m]);
  };

  const getPieData = () => {
    const categories: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.keys(categories)
      .map((name) => ({ name, value: categories[name] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const trendData = getTrendData();
  const pieData = getPieData();

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Food: "🍕", Groceries: "🛒", Rent: "🏠", Utilities: "⚡", Petrol: "⛽",
      Transport: "🚗", Shopping: "🛍️", Entertainment: "🎬", Medical: "💊",
      Education: "📚", EMI: "🏦", Insurance: "🛡️", Investments: "📈",
      Salary: "💰", Freelance: "💻", Business: "🏢", Interest: "📊",
      Refund: "↩️", Gift: "🎁", Miscellaneous: "📋", Other: "📋",
    };
    return icons[category] || "📋";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-purple-50 text-purple-600",
      Groceries: "bg-green-50 text-green-600",
      Rent: "bg-blue-50 text-blue-600",
      Utilities: "bg-yellow-50 text-yellow-600",
      Transport: "bg-orange-50 text-orange-600",
      Shopping: "bg-pink-50 text-pink-600",
      Entertainment: "bg-indigo-50 text-indigo-600",
      Salary: "bg-emerald-50 text-emerald-600",
    };
    return colors[category] || "bg-slate-50 text-slate-600";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="chart-tooltip">
        <p className="text-xs font-bold text-text-primary mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
            {p.name}: {formatINR(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      
      {/* Greeting Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-[32px] font-bold tracking-tight text-text-primary leading-tight">
            {getGreeting()}, Sahil 👋
          </h1>
          <p className="text-sm text-text-secondary mt-1 font-medium">
            Your financial journey is looking great!
          </p>
        </div>
        <button
          onClick={() => setAddTransactionOpen(true)}
          className="md:hidden btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </motion.header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          {
            title: "Net Worth",
            value: formatINR(currentBalance),
            trend: "+12.4%",
            trendUp: true,
            trendLabel: "from last month",
            icon: <Wallet className="w-5 h-5 text-brand" />,
            accent: "border-l-brand",
          },
          {
            title: "Monthly Income",
            value: formatINR(totalIncome),
            trend: "+8.2%",
            trendUp: true,
            trendLabel: "from last month",
            icon: <ArrowUpRight className="w-5 h-5 text-accent-green" />,
            accent: "border-l-accent-green",
          },
          {
            title: "Monthly Expenses",
            value: formatINR(totalExpense),
            trend: "-5.1%",
            trendUp: false,
            trendLabel: "from last month",
            icon: <ArrowDownRight className="w-5 h-5 text-accent-red" />,
            accent: "border-l-accent-red",
          },
          {
            title: "Savings Rate",
            value: `${savingsRate}%`,
            trend: "+4%",
            trendUp: true,
            trendLabel: "from last month",
            icon: <TrendingUp className="w-5 h-5 text-accent-blue" />,
            accent: "border-l-accent-blue",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`card p-5 space-y-3 border-l-4 ${kpi.accent} hover:shadow-hover transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {kpi.title}
              </span>
              {kpi.icon}
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-text-primary tracking-tight">
              {kpi.value}
            </h2>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  kpi.trendUp
                    ? "bg-green-50 text-accent-green"
                    : "bg-red-50 text-accent-red"
                }`}
              >
                {kpi.trend}
              </span>
              <span className="text-[11px] text-text-muted">{kpi.trendLabel}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Charts Row: Cash Flow + AI Insight */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cash Flow Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Cash Flow Overview</h3>
              <p className="text-xs text-text-secondary mt-0.5">Income vs Expenses trend</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-green" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-red" /> Expense
              </span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            {isMounted && trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Income"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#incomeGrad)"
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />
                  <Area
                    type="monotone"
                    dataKey="Expense"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    fill="url(#expenseGrad)"
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-text-muted">
                No chart data yet
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-[20px] p-6 border border-purple-100 bg-gradient-to-br from-[#F5F3FF] via-[#EEF2FF] to-[#F0F9FF] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand fill-brand/20" /> AI Insight
              </span>
              <span className="text-[10px] font-bold text-accent-green bg-green-50 px-2 py-0.5 rounded-full">New</span>
            </div>
            <h4 className="text-base font-bold text-text-primary mb-2">Great job! 🎉</h4>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Your food spending decreased by 12% this month. You saved ₹1,100 compared to May. Keep optimizing your daily expenses!
            </p>
          </div>

          <button
            onClick={() => setAiAssistantOpen(true)}
            className="mt-5 btn-primary py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 w-full"
          >
            <span>View More Insights</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Bottom Row: Recent Transactions + Goal Progress */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-text-primary">Recent Transactions</h3>
            <Link
              href="/dashboard/transactions"
              className="text-xs font-semibold text-brand hover:text-brand-light transition-colors flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-1">
            {recentTransactions.slice(0, 5).map((tx: Doc<"transactions">, i: number) => (
              <div
                key={tx._id}
                className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-hover-row transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${getCategoryColor(tx.category)}`}>
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{tx.notes || tx.category}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {tx.category} · {tx.time || tx.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ${
                    tx.type === "income" ? "text-accent-green" : "text-accent-red"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}{formatINR(tx.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Add Transaction shortcut */}
          <button
            onClick={() => setAddTransactionOpen(true)}
            className="mt-4 w-full py-3 btn-primary rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Transaction
          </button>
        </motion.div>

        {/* Goal Progress + Spending Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-text-primary">Spending Breakdown</h3>
            <Link
              href="/dashboard/reports"
              className="text-xs font-semibold text-brand hover:text-brand-light transition-colors flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Spending Amount */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-extrabold text-text-primary">{formatINR(totalExpense)}</p>
              <p className="text-xs text-text-secondary mt-0.5">Total spending this period</p>
            </div>
          </div>

          {/* Mini Pie Chart + Legend */}
          <div className="flex items-center gap-6">
            <div className="w-[120px] h-[120px] shrink-0">
              {isMounted && pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                      animationDuration={800}
                    >
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            <div className="flex-1 space-y-2.5">
              {pieData.map((cat, idx) => {
                const pct = totalExpense > 0 ? Math.round((cat.value / totalExpense) * 100) : 0;
                return (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="font-medium text-text-primary">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-text-secondary">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
