"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@/hooks/use-convex";
import { api } from "../../../../convex/_generated/api";
import {
  TrendingUp,
  Download,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#7C3AED", "#2563EB", "#10B981", "#F59E0B", "#EC4899", "#9333EA", "#64748B"];

export default function ReportsView() {
  const [reportTab, setReportTab] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [isMounted, setIsMounted] = useState(false);
  const transactions = useQuery(api.transactions.list, {}) || [];

  useEffect(() => { setIsMounted(true); }, []);

  const formatINR = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const getAggregates = () => {
    let incomeSum = 0, expenseSum = 0;
    const catMap: Record<string, number> = {};
    const trendsMap: Record<string, { name: string; Income: number; Expense: number }> = {};
    const now = new Date();

    const filtered = transactions.filter((t) => {
      const tDate = new Date(t.date);
      const diffDays = Math.ceil(Math.abs(now.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24));
      if (reportTab === "weekly") return diffDays <= 7;
      if (reportTab === "monthly") return diffDays <= 30;
      return diffDays <= 365;
    });

    filtered.forEach((t) => {
      if (t.type === "income") incomeSum += t.amount;
      else { expenseSum += t.amount; catMap[t.category] = (catMap[t.category] || 0) + t.amount; }

      let key = t.date;
      if (reportTab === "weekly") key = new Date(t.date).toLocaleDateString("en-IN", { weekday: "short" });
      else if (reportTab === "monthly") key = new Date(t.date).toLocaleDateString("en-IN", { month: "short", day: "2-digit" });
      else key = new Date(t.date).toLocaleDateString("en-IN", { month: "short" });

      if (!trendsMap[key]) trendsMap[key] = { name: key, Income: 0, Expense: 0 };
      if (t.type === "income") trendsMap[key].Income += t.amount;
      else trendsMap[key].Expense += t.amount;
    });

    return {
      incomeSum, expenseSum, savingsSum: Math.max(0, incomeSum - expenseSum),
      pieData: Object.keys(catMap).map((c) => ({ name: c, value: catMap[c] })).sort((a, b) => b.value - a.value),
      trendData: Object.values(trendsMap),
    };
  };

  const { incomeSum, expenseSum, savingsSum, pieData, trendData } = getAggregates();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="chart-tooltip">
        <p className="text-xs font-bold text-text-primary mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs font-medium" style={{ color: p.color }}>{p.name}: {formatINR(p.value)}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto print:p-0">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Reports & Insights</h1>
          <p className="text-sm text-text-secondary mt-0.5">Financial analytics & spending patterns</p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary px-4 py-2.5 text-xs flex items-center gap-1.5" title="Print Report">
          <Download className="w-3.5 h-3.5" /> Export PDF
        </button>
      </header>

      {/* Period Tabs */}
      <section className="flex gap-1 p-1 bg-page-bg border border-border rounded-2xl max-w-sm print:hidden">
        {(["weekly", "monthly", "yearly"] as const).map((tab) => (
          <button key={tab} onClick={() => setReportTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              reportTab === tab ? "btn-primary shadow-sm" : "text-text-muted hover:text-text-primary"
            }`}>
            {tab}
          </button>
        ))}
      </section>

      {/* Spending Overview Card */}
      <section className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Spending Overview</p>
            <p className="text-3xl font-extrabold text-text-primary mt-1">{formatINR(expenseSum)}</p>
            <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
              {expenseSum < incomeSum ? (
                <><span className="text-accent-green font-bold flex items-center gap-0.5"><ArrowDownRight className="w-3 h-3" /> -5.1%</span> vs last period</>
              ) : (
                <><span className="text-accent-red font-bold flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +3.2%</span> vs last period</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Aggregate Cards */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Income", value: formatINR(incomeSum), icon: <ArrowUpRight className="w-4 h-4 text-accent-green" />, color: "border-l-accent-green" },
          { label: "Total Expenses", value: formatINR(expenseSum), icon: <ArrowDownRight className="w-4 h-4 text-accent-red" />, color: "border-l-accent-red" },
          { label: "Net Savings", value: formatINR(savingsSum), icon: <TrendingUp className="w-4 h-4 text-accent-blue" />, color: "border-l-accent-blue" },
        ].map((stat) => (
          <div key={stat.label} className={`card p-5 text-center space-y-1.5 border-l-4 ${stat.color}`}>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center justify-center gap-1">{stat.icon} {stat.label}</span>
            <h2 className="text-lg font-extrabold text-text-primary">{stat.value}</h2>
          </div>
        ))}
      </section>

      {/* Charts Grid */}
      {transactions.length === 0 ? (
        <div className="py-16 text-center text-sm text-text-muted card">No transactions to analyze.</div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cash Flow Chart */}
          <div className="card p-6 lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Cash Inflows & Outflows</h3>
              <p className="text-xs text-text-secondary mt-0.5">Timeline trends for selected period</p>
            </div>
            <div className="h-[240px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rIncGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="rExpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2.5} fill="url(#rIncGrad)" animationDuration={1200} />
                    <Area type="monotone" dataKey="Expense" stroke="#EF4444" strokeWidth={2.5} fill="url(#rExpGrad)" animationDuration={1200} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Expense Distribution</h3>
              <p className="text-xs text-text-secondary mt-0.5">Category share breakdown</p>
            </div>
            <div className="h-[180px] flex items-center justify-center">
              {isMounted && pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0} animationDuration={800}>
                      {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatINR(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-text-muted">No expense data</p>}
            </div>
            {pieData.length > 0 && (
              <div className="space-y-1.5 pt-3 border-t border-border">
                {pieData.slice(0, 5).map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium text-text-primary">{d.name}</span>
                    </div>
                    <span className="font-semibold text-text-secondary">{formatINR(d.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* AI Summary */}
      <section className="rounded-[20px] p-6 bg-gradient-to-br from-[#F5F3FF] via-[#EEF2FF] to-[#F0F9FF] border border-purple-100 space-y-3">
        <div className="flex items-center gap-1.5 text-brand font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> SHYN AI Report Overview
        </div>
        <div className="text-sm leading-relaxed text-text-secondary">
          {incomeSum === 0 && expenseSum === 0 ? (
            <p>Log transactions to enable AI analytics summaries.</p>
          ) : (
            <div className="space-y-3">
              <p>
                During this period, your savings rate stood at <strong className="text-text-primary">{incomeSum > 0 ? Math.round((savingsSum / incomeSum) * 100) : 0}%</strong>. 
                Your highest expenditure category was <strong className="text-text-primary">{pieData[0]?.name || "General"}</strong> at {formatINR(pieData[0]?.value || 0)}.
              </p>
              <div className="border-l-4 border-brand/30 pl-4 py-2 italic text-brand/80 font-medium text-sm">
                💡 Reducing your {pieData[0]?.name || "top"} budget by 8% could save ₹1,800/month. Redirect savings to your active goals.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
