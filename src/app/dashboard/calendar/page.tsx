"use client";

import React, { useState } from "react";
import { useQuery, useAction } from "@/hooks/use-convex";
import { api } from "../../../../convex/_generated/api";
import {
  ChevronLeft, ChevronRight, X, Sparkles,
  ArrowUpRight, ArrowDownRight, Clock, Info
} from "lucide-react";
import { Doc } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;

  const calendarData = useQuery(api.transactions.getCalendarData, { startDate, endDate }) || {};
  const dailyAnalytics = useQuery(api.transactions.getDailyAnalytics, selectedDateStr ? { date: selectedDateStr } : "skip");
  const getGeminiChat = useAction(api.ai.chat);

  const getDaysInMonth = () => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
    return cells;
  };

  const cells = getDaysInMonth();
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (date: Date) => {
    const dStr = date.toISOString().split("T")[0];
    setAiInsight(null); setSelectedDateStr(dStr); setIsDrawerOpen(true);
  };

  const generateDailyInsights = async () => {
    if (!selectedDateStr || !dailyAnalytics) return;
    setIsGeneratingInsight(true);
    try {
      const summary = `Analyze my expenses for ${selectedDateStr}. Total income: ₹${dailyAnalytics.totalIncome}, expenses: ₹${dailyAnalytics.totalExpense}. Transactions: ${JSON.stringify(dailyAnalytics.transactions)}. Give a short 2-sentence suggestion.`;
      const reply = await getGeminiChat({ message: summary });
      setAiInsight(reply);
    } catch (e) {
      console.error(e);
      setAiInsight("Stay within your monthly budget! Try logging recurring bills in advance.");
    } finally { setIsGeneratingInsight(false); }
  };

  const getHeatmapGrid = () => {
    const grid: any[] = [];
    const today = new Date();
    for (let i = 59; i >= 0; i--) {
      const d = new Date(); d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      grid.push({ date: d, dateStr: dStr, spent: calendarData[dStr]?.expense || 0 });
    }
    return grid;
  };

  const heatmapData = getHeatmapGrid();

  const getHeatmapColor = (spent: number) => {
    if (spent === 0) return "bg-purple-50 border border-purple-100";
    if (spent < 500) return "bg-purple-100 border border-purple-200";
    if (spent < 2000) return "bg-purple-300 border border-purple-400";
    if (spent < 5000) return "bg-purple-500 border border-purple-600";
    return "bg-purple-800 border border-purple-900";
  };

  const formatINR = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Calendar & Spend Map</h1>
          <p className="text-sm text-text-secondary mt-0.5">Interactive financial calendar with daily analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="p-2.5 border border-border rounded-xl hover:bg-hover text-text-secondary transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-sm text-text-primary px-4">
            {currentDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
          <button onClick={handleNextMonth} className="p-2.5 border border-border rounded-xl hover:bg-hover text-text-secondary transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Heatmap */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-text-primary font-bold text-xs uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-brand" /> 60-Day Spending Heatmap
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-text-muted uppercase">
            <span>Less</span>
            <span className="w-2.5 h-2.5 bg-purple-50 border border-purple-100 rounded-sm" />
            <span className="w-2.5 h-2.5 bg-purple-100 border border-purple-200 rounded-sm" />
            <span className="w-2.5 h-2.5 bg-purple-300 border border-purple-400 rounded-sm" />
            <span className="w-2.5 h-2.5 bg-purple-500 border border-purple-600 rounded-sm" />
            <span className="w-2.5 h-2.5 bg-purple-800 border border-purple-900 rounded-sm" />
            <span>More</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 py-1">
          {heatmapData.map((d, i) => (
            <div key={i} title={`${d.dateStr}: ${formatINR(d.spent)}`}
              className={`w-6 h-6 rounded-md ${getHeatmapColor(d.spent)} transition-all hover:scale-110 cursor-pointer shrink-0`} />
          ))}
        </div>
      </section>

      {/* Calendar Grid */}
      <section className="card overflow-hidden flex-1">
        <div className="grid grid-cols-7 border-b border-border bg-page-bg py-3 text-center text-[10px] font-bold uppercase tracking-wider text-text-muted">
          {dayLabels.map((lbl) => <div key={lbl}>{lbl}</div>)}
        </div>
        <div className="grid grid-cols-7 divide-x divide-y divide-border">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="bg-page-bg/50 aspect-square md:h-28" />;

            const dStr = day.toISOString().split("T")[0];
            const stats = calendarData[dStr];
            const hasIncome = stats && stats.income > 0;
            const hasExpense = stats && stats.expense > 0;
            const count = stats?.count || 0;
            const isToday = new Date().toDateString() === day.toDateString();

            return (
              <div key={dStr} onClick={() => handleDateClick(day)}
                className={`bg-card hover:bg-hover-row p-2 md:p-3 aspect-square md:h-28 flex flex-col justify-between cursor-pointer transition-colors relative group ${
                  isToday ? "ring-2 ring-inset ring-brand" : ""
                }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold ${isToday ? "text-brand" : "text-text-secondary"}`}>{day.getDate()}</span>
                  {count > 0 && (
                    <span className="w-4 h-4 bg-brand-bg text-brand font-bold text-[8px] flex items-center justify-center rounded-full">{count}</span>
                  )}
                </div>
                <div className="space-y-0.5 text-left pt-2">
                  {hasIncome && <div className="text-[9px] font-bold text-accent-green leading-none truncate">+{formatINR(stats.income)}</div>}
                  {hasExpense && <div className="text-[9px] font-bold text-accent-red leading-none truncate">-{formatINR(stats.expense)}</div>}
                </div>
                <div className="flex gap-1 justify-center pt-1 mt-auto">
                  {hasIncome && <span className="w-1.5 h-1.5 bg-accent-green rounded-full" />}
                  {hasExpense && <span className="w-1.5 h-1.5 bg-accent-red rounded-full" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-accent-green rounded-full" /> Income</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-accent-red rounded-full" /> Expense</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-brand rounded-full ring-2 ring-brand/20" /> Today</span>
      </div>

      {/* Date Detail Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedDateStr && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-50 bg-black" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-card border-l border-border flex flex-col shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-border shrink-0">
                <div>
                  <h3 className="font-bold text-text-primary text-sm">Day Ledger Details</h3>
                  <p className="text-[10px] text-text-muted font-medium">{selectedDateStr}</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 hover:bg-hover text-text-muted hover:text-text-primary rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {dailyAnalytics ? (
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-page-bg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card p-4 space-y-1">
                      <span className="text-[10px] font-semibold text-text-muted uppercase flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5 text-accent-green" /> Income
                      </span>
                      <h4 className="text-base font-extrabold text-text-primary">{formatINR(dailyAnalytics.totalIncome)}</h4>
                    </div>
                    <div className="card p-4 space-y-1">
                      <span className="text-[10px] font-semibold text-text-muted uppercase flex items-center gap-1">
                        <ArrowDownRight className="w-3.5 h-3.5 text-accent-red" /> Expenses
                      </span>
                      <h4 className="text-base font-extrabold text-accent-red">{formatINR(dailyAnalytics.totalExpense)}</h4>
                    </div>
                  </div>

                  <div className="card p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-text-muted uppercase">Net Cash Flow</span>
                      <h4 className={`text-base font-extrabold ${dailyAnalytics.netBalance >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                        {dailyAnalytics.netBalance >= 0 ? "+" : ""}{formatINR(dailyAnalytics.netBalance)}
                      </h4>
                    </div>
                  </div>

                  {/* AI insights */}
                  <div className="rounded-xl p-5 bg-gradient-to-br from-[#F5F3FF] via-[#EEF2FF] to-[#F0F9FF] border border-purple-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-brand font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> Daily AI Insights
                      </div>
                      {!aiInsight && !isGeneratingInsight && (
                        <button onClick={generateDailyInsights} className="btn-primary px-3 py-1.5 text-[10px]">Generate</button>
                      )}
                    </div>
                    {isGeneratingInsight && (
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                        Analyzing transactions...
                      </div>
                    )}
                    {aiInsight && <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{aiInsight}</p>}
                  </div>

                  {/* Transactions list */}
                  <div className="space-y-3">
                    <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Daily Records</div>
                    {dailyAnalytics.transactions.length === 0 ? (
                      <div className="py-12 text-center text-sm text-text-muted card">No transactions on this day.</div>
                    ) : (
                      <div className="space-y-2">
                        {dailyAnalytics.transactions.map((tx: Doc<"transactions">) => (
                          <div key={tx._id} className="card p-4 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-text-primary">{tx.category}</span>
                                <span className="text-[9px] px-2 py-0.5 bg-page-bg text-text-muted font-semibold rounded-lg border border-border">{tx.paymentMethod}</span>
                              </div>
                              {tx.notes && <p className="text-[10px] text-text-secondary">{tx.notes}</p>}
                              {tx.time && (
                                <span className="text-[9px] text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {tx.time}</span>
                              )}
                            </div>
                            <span className={`text-xs font-extrabold ${tx.type === "income" ? "text-accent-green" : "text-accent-red"}`}>
                              {tx.type === "income" ? "+" : "-"}{formatINR(tx.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
