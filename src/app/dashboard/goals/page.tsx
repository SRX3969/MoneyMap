"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@/hooks/use-convex";
import { api } from "../../../../convex/_generated/api";
import { Target, Plus, Trash2, Calendar, Sparkles, ChevronDown, ChevronUp, History } from "lucide-react";
import { Id } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function GoalsView() {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contribGoalId, setContribGoalId] = useState<Id<"goals"> | null>(null);
  const [contribAmount, setContribAmount] = useState("");
  const [isContribSubmitting, setIsContribSubmitting] = useState(false);
  const [expandedGoalIds, setExpandedGoalIds] = useState<Id<"goals">[]>([]);

  const goals = useQuery(api.goals.list) || [];
  const createGoal = useMutation(api.goals.create);
  const deleteGoal = useMutation(api.goals.remove);
  const addContribution = useMutation(api.goals.addContribution);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim() || !targetAmount || isNaN(Number(targetAmount))) return;
    setIsSubmitting(true);
    try {
      await createGoal({ name: goalName, targetAmount: Number(targetAmount), deadline, notes: notes || undefined });
      setGoalName(""); setTargetAmount(""); setDeadline(""); setNotes("");
    } catch (err) { console.error(err); alert("Failed to create goal"); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteGoal = async (id: Id<"goals">) => {
    if (confirm("Delete this goal and all contributions?")) await deleteGoal({ id });
  };

  const handleAddContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribGoalId || !contribAmount || isNaN(Number(contribAmount))) return;
    setIsContribSubmitting(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const result = await addContribution({ goalId: contribGoalId, amount: Number(contribAmount), date: today });
      setContribAmount(""); setContribGoalId(null);
      if (result.isCompleted) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#7C3AED", "#9333EA", "#10B981", "#2563EB", "#F59E0B"] });
      }
    } catch (err) { console.error(err); alert("Failed to log contribution"); }
    finally { setIsContribSubmitting(false); }
  };

  const toggleHistory = (id: Id<"goals">) => {
    setExpandedGoalIds(expandedGoalIds.includes(id) ? expandedGoalIds.filter((x) => x !== id) : [...expandedGoalIds, id]);
  };

  const formatINR = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Financial Goals</h1>
          <p className="text-sm text-text-secondary mt-0.5">Track savings targets & milestones</p>
        </div>
      </header>

      {/* Grid: Create Goal + Analytics */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Create Goal Form */}
        <div className="card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Create Savings Goal</h3>
            <p className="text-xs text-text-secondary mt-0.5">Set targets for future investments</p>
          </div>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Goal Name</label>
              <input type="text" required placeholder="e.g. Emergency Fund" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="input-field w-full text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Target (₹)</label>
                <input type="number" required placeholder="50000" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="input-field w-full text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Target Date</label>
                <input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-field w-full text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Notes (Optional)</label>
              <input type="text" placeholder="Short details..." value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field w-full text-sm" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 btn-primary rounded-xl text-sm flex items-center justify-center gap-1.5">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><Plus className="w-4 h-4" /> Start Goal</>}
            </button>
          </form>
        </div>

        {/* Analytics Panel */}
        <div className="card p-6 lg:col-span-2 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-text-primary font-bold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4 text-brand" /> Goal Analytics & Milestones
            </div>
            <p className="text-xs text-text-secondary mt-0.5">Tracking savings consistency</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 py-2">
            {[
              { label: "Active Goals", value: goals.filter(g => g.status === "active").length },
              { label: "Total Saved", value: formatINR(goals.reduce((s, g) => s + g.currentAmount, 0)) },
              { label: "Completed", value: goals.filter(g => g.status === "completed").length },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{stat.label}</span>
                <div className="text-xl font-extrabold text-text-primary mt-0.5">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-brand-bg border border-purple-100 p-4 rounded-xl space-y-1">
            <div className="text-[10px] uppercase font-bold text-brand tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Goal Coach Tip
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Allocate 15-20% of your salary to goals on payday. Reaching targets triggers a celebration! 🎉
            </p>
          </div>
        </div>
      </section>

      {/* Goals Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Active & Completed Goals</h3>
        {goals.length === 0 ? (
          <div className="py-16 text-center text-sm text-text-muted card">No savings goals set. Create one above.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((g) => {
              const isExpanded = expandedGoalIds.includes(g._id);
              const isContributing = contribGoalId === g._id;
              const isCompleted = g.status === "completed";

              return (
                <div key={g._id} className="card p-6 space-y-4 hover:shadow-hover transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                        {g.name}
                        {isCompleted && (
                          <span className="text-[10px] font-bold bg-accent-green text-white px-2 py-0.5 rounded-full uppercase">
                            Completed 🎉
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> Target: {g.deadline}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteGoal(g._id)} className="p-1.5 hover:bg-red-50 text-text-muted hover:text-accent-red rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-page-bg border border-border rounded-full overflow-hidden">
                      <div className="h-full progress-gradient transition-all duration-500" style={{ width: `${Math.min(g.percent, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-text-secondary font-medium">
                      <span>{Math.round(g.percent)}% Saved</span>
                      <span>{formatINR(g.currentAmount)} / {formatINR(g.targetAmount)}</span>
                    </div>
                  </div>

                  {g.notes && <p className="text-xs text-text-muted leading-relaxed">{g.notes}</p>}

                  <div className="pt-3 border-t border-border flex items-center justify-between gap-4">
                    <button onClick={() => toggleHistory(g._id)} className="text-xs font-semibold text-text-muted hover:text-text-primary flex items-center gap-0.5 transition-colors">
                      <History className="w-3.5 h-3.5" /> History
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {!isCompleted && !isContributing && (
                      <button onClick={() => setContribGoalId(g._id)} className="btn-secondary px-3.5 py-1.5 text-xs">
                        Add Savings
                      </button>
                    )}
                  </div>

                  {/* Contribution Form */}
                  <AnimatePresence>
                    {isContributing && (
                      <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddContribution} className="p-3 bg-page-bg border border-border rounded-xl space-y-3">
                        <div className="flex gap-2">
                          <input type="number" required placeholder="Amount (₹)" value={contribAmount} onChange={(e) => setContribAmount(e.target.value)}
                            className="input-field flex-1 text-sm font-bold" />
                          <button type="submit" disabled={isContribSubmitting} className="btn-primary px-3 py-1.5 text-xs">
                            {isContribSubmitting ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Save"}
                          </button>
                          <button type="button" onClick={() => { setContribGoalId(null); setContribAmount(""); }} className="btn-secondary px-2 py-1.5 text-xs">Cancel</button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* History */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5 bg-page-bg p-3 rounded-xl border border-border overflow-hidden">
                        <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-2">Contribution Logs</div>
                        {g.contributions.length === 0 ? (
                          <div className="text-xs text-text-muted text-center py-2">No contributions recorded</div>
                        ) : (
                          g.contributions.map((c) => (
                            <div key={c._id} className="flex justify-between items-center text-xs py-1.5 border-b border-border last:border-b-0">
                              <span className="text-text-secondary">{c.date}</span>
                              <span className="font-bold text-accent-green">+{formatINR(c.amount)}</span>
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
