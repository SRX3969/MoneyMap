"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Trash2,
  Calendar,
  Sparkles,
  Info
} from "lucide-react";
import { Id } from "@/types";

const EXPENSE_CATEGORIES = [
  "all", "Food", "Groceries", "Rent", "Utilities", "Petrol", "Transport",
  "Shopping", "Entertainment", "Medical", "Education", "EMI",
  "Insurance", "Investments", "Miscellaneous"
];

export default function BudgetsView() {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [budgetCategory, setBudgetCategory] = useState("all");
  const [budgetAmount, setBudgetAmount] = useState("");

  const budgets = useQuery(api.budgets.list, { month: selectedMonth }) || [];
  const forecast = useQuery(api.budgets.getForecast, { month: selectedMonth });
  const upsertBudget = useMutation(api.budgets.upsert);
  const removeBudget = useMutation(api.budgets.remove);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetAmount || isNaN(Number(budgetAmount)) || Number(budgetAmount) <= 0) {
      alert("Please enter a valid budget amount"); return;
    }
    setIsSubmitting(true);
    try {
      await upsertBudget({ amount: Number(budgetAmount), category: budgetCategory, month: selectedMonth });
      setBudgetAmount("");
    } catch (err) { console.error(err); alert("Failed to save budget"); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteBudget = async (id: Id<"budgets">) => {
    if (confirm("Remove this budget?")) await removeBudget({ id });
  };

  const formatINR = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  // Overall budget from "all" category
  const overallBudget = budgets.find(b => b.category === "all");

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Budget Planner</h1>
          <p className="text-sm text-text-secondary mt-0.5">Monthly spending allocations & forecasts</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-muted" />
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-field px-3.5 py-2 text-sm font-semibold" />
          <button onClick={() => {}} className="btn-primary px-4 py-2.5 text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Budget
          </button>
        </div>
      </header>

      {/* Overall Budget Card */}
      {overallBudget && (
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Overall Budget</p>
              <p className="text-3xl font-extrabold text-text-primary mt-1">{formatINR(overallBudget.amount)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary">Spent</p>
              <p className="text-lg font-bold text-text-primary">{formatINR(overallBudget.spent)}</p>
              <p className="text-xs text-text-secondary mt-0.5">Remaining: <span className={`font-bold ${overallBudget.remaining <= 0 ? "text-accent-red" : "text-accent-green"}`}>{formatINR(overallBudget.remaining)}</span></p>
            </div>
          </div>
          <div className="w-full h-3 bg-page-bg border border-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${
              overallBudget.percent >= 100 ? "progress-red" : overallBudget.percent >= 80 ? "progress-orange" : "progress-gradient"
            }`} style={{ width: `${Math.min(overallBudget.percent, 100)}%` }} />
          </div>
          <p className="text-xs text-text-muted mt-2 text-right font-medium">{Math.round(overallBudget.percent)}% used</p>
        </section>
      )}

      {/* Grid: Create Budget + Forecast */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Create Budget Form */}
        <div className="card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Set Budget Limit</h3>
            <p className="text-xs text-text-secondary mt-0.5">Define monthly ceilings per category</p>
          </div>
          <form onSubmit={handleSaveBudget} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Category</label>
              <select value={budgetCategory} onChange={(e) => setBudgetCategory(e.target.value)} className="input-field w-full text-sm">
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === "all" ? "Global Budget (All)" : c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">₹</span>
                <input type="number" required placeholder="15000" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)}
                  className="input-field w-full pl-8 font-bold" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 btn-primary rounded-xl text-sm flex items-center justify-center gap-1.5">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><Plus className="w-4 h-4" /> Set Budget</>}
            </button>
          </form>
        </div>

        {/* Forecasting Panel */}
        <div className="card p-6 lg:col-span-2 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-text-primary font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-brand" /> Spend Projections & Forecasts
            </div>
            <p className="text-xs text-text-secondary mt-0.5">Linear projection of current spending patterns</p>
          </div>

          {forecast && forecast.globalBudget > 0 ? (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Spent to Date", value: formatINR(forecast.totalSpent) },
                  { label: "Projected Spend", value: formatINR(forecast.projectedSpend) },
                  { label: "Active Limit", value: formatINR(forecast.globalBudget) },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{stat.label}</div>
                    <div className="text-lg font-extrabold text-text-primary mt-0.5">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-xl border flex gap-3 ${
                forecast.isOverBudget
                  ? "bg-red-50 border-red-200 text-accent-red"
                  : "bg-green-50 border-green-200 text-accent-green"
              }`}>
                <div className="shrink-0 mt-0.5">
                  {forecast.isOverBudget
                    ? <AlertTriangle className="w-4 h-4 animate-bounce" />
                    : <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold leading-tight">
                    {forecast.isOverBudget ? "Over-Budget Risk Detected" : "Budget On Track ✓"}
                  </h4>
                  <p className="text-[11px] leading-relaxed">
                    {forecast.isOverBudget
                      ? `Day ${forecast.currentDay}/${forecast.daysInMonth}: projected to exceed by ${formatINR(forecast.varianceAmount)}.`
                      : `On pace to finish under budget by ${formatINR(forecast.varianceAmount)}.`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-text-muted flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-brand animate-pulse-subtle" />
              <span>Set a Global &quot;all&quot; budget to enable spending projections.</span>
            </div>
          )}

          <div className="text-xs text-text-muted flex items-center gap-1.5 border-t border-border pt-3">
            <Info className="w-3.5 h-3.5 text-brand" /> Updates automatically as transactions are recorded.
          </div>
        </div>
      </section>

      {/* Category Budgets Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Category Budgets</h3>

        {budgets.length === 0 ? (
          <div className="py-16 text-center text-sm text-text-muted card">
            No budgets configured for this month. Set one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((b) => (
              <div key={b._id} className="card p-5 space-y-4 hover:shadow-hover transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">
                      {b.category === "all" ? "Global Budget" : b.category}
                    </h4>
                    <span className="text-[10px] font-medium text-text-muted">{b.month}</span>
                  </div>
                  <button onClick={() => handleDeleteBudget(b._id)}
                    className="p-1.5 hover:bg-red-50 text-text-muted hover:text-accent-red rounded-lg transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="w-full h-2.5 bg-page-bg border border-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${
                      b.percent >= 100 ? "progress-red" : b.percent >= 80 ? "progress-orange" : "progress-gradient"
                    }`} style={{ width: `${Math.min(b.percent, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary font-medium">
                    <span>{Math.round(b.percent)}% Used</span>
                    <span>{formatINR(b.spent)} / {formatINR(b.amount)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between text-xs">
                  <span className="text-text-muted">Remaining</span>
                  <span className={`font-bold ${b.remaining <= 0 ? "text-accent-red" : "text-accent-green"}`}>
                    {formatINR(b.remaining)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
