"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@/hooks/use-convex";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "@/types";
import {
  RefreshCw, Plus, Trash2, Edit3, Check, X, Clock,
  AlertCircle, Calendar, Sparkles, ArrowUpRight, ArrowDownRight, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXPENSE_CATEGORIES = ["Food","Groceries","Rent","Utilities","Petrol","Transport","Shopping","Entertainment","Medical","Education","EMI","Insurance","Investments","Miscellaneous"];
const INCOME_CATEGORIES = ["Salary","Freelance","Business","Interest","Refund","Gift","Other"];
const FREQUENCIES = [
  { value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" }, { value: "yearly", label: "Yearly" },
] as const;

export default function RecurringTransactionsView() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Rent");
  const [frequency, setFrequency] = useState<"daily"|"weekly"|"monthly"|"yearly">("monthly");
  const [nextDueDate, setNextDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editId, setEditId] = useState<Id<"recurringTransactions"> | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editFrequency, setEditFrequency] = useState<"daily"|"weekly"|"monthly"|"yearly">("monthly");
  const [editNextDueDate, setEditNextDueDate] = useState("");
  const [payingId, setPayingId] = useState<Id<"recurringTransactions"> | null>(null);

  const recurringItems = useQuery(api.recurring.list) || [];
  const createRecurring = useMutation(api.recurring.create);
  const updateRecurring = useMutation(api.recurring.update);
  const removeRecurring = useMutation(api.recurring.remove);
  const markAsPaid = useMutation(api.recurring.markAsPaid);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || isNaN(Number(amount)) || !nextDueDate) return;
    setIsSubmitting(true);
    try { await createRecurring({ description: description.trim(), amount: Number(amount), type, category, frequency, nextDueDate }); setDescription(""); setAmount(""); setNextDueDate(""); }
    catch (err) { console.error(err); alert("Failed to create"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: Id<"recurringTransactions">) => { if (confirm("Delete?")) await removeRecurring({ id }); };

  const handleStartEdit = (item: Doc<"recurringTransactions">) => {
    setEditId(item._id); setEditDescription(item.description); setEditAmount(String(item.amount));
    setEditFrequency(item.frequency); setEditNextDueDate(item.nextDueDate);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    try { await updateRecurring({ id: editId, description: editDescription.trim() || undefined, amount: editAmount ? Number(editAmount) : undefined, frequency: editFrequency, nextDueDate: editNextDueDate || undefined }); setEditId(null); }
    catch (err) { console.error(err); alert("Failed to update"); }
  };

  const handleMarkAsPaid = async (id: Id<"recurringTransactions">) => {
    setPayingId(id);
    try { await markAsPaid({ id }); } catch (err) { console.error(err); alert("Failed"); }
    finally { setPayingId(null); }
  };

  const formatINR = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const getDueStatus = (dueDateStr: string) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const due = new Date(dueDateStr + "T00:00:00");
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000*60*60*24));
    if (diffDays < 0) return { label: "Overdue", color: "text-accent-red", bg: "bg-red-50 border-red-100", days: diffDays };
    if (diffDays === 0) return { label: "Due Today", color: "text-accent-red", bg: "bg-red-50 border-red-100", days: 0 };
    if (diffDays <= 3) return { label: `Due in ${diffDays}d`, color: "text-accent-orange", bg: "bg-amber-50 border-amber-100", days: diffDays };
    if (diffDays <= 7) return { label: `Due in ${diffDays}d`, color: "text-accent-blue", bg: "bg-blue-50 border-blue-100", days: diffDays };
    return { label: `Due in ${diffDays}d`, color: "text-text-secondary", bg: "bg-page-bg border-border", days: diffDays };
  };

  const getFrequencyLabel = (freq: string) => FREQUENCIES.find((f) => f.value === freq)?.label || freq;

  const totalMonthlyExpense = recurringItems.filter(r => r.type === "expense").reduce((sum, r) => {
    const m = r.frequency === "daily" ? 30 : r.frequency === "weekly" ? 4 : r.frequency === "yearly" ? 1/12 : 1;
    return sum + r.amount * m;
  }, 0);

  const totalMonthlyIncome = recurringItems.filter(r => r.type === "income").reduce((sum, r) => {
    const m = r.frequency === "daily" ? 30 : r.frequency === "weekly" ? 4 : r.frequency === "yearly" ? 1/12 : 1;
    return sum + r.amount * m;
  }, 0);

  const upcomingCount = recurringItems.filter(r => getDueStatus(r.nextDueDate).days <= 7).length;

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Recurring Transactions</h1>
          <p className="text-sm text-text-secondary mt-0.5">Autopay, subscriptions & scheduled entries</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-bg border border-purple-100 rounded-xl">
            <RefreshCw className="w-3.5 h-3.5 text-brand" />
            <span className="text-xs font-bold text-brand">{recurringItems.length} Active</span>
          </div>
          {upcomingCount > 0 && (
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 text-accent-orange" />
              <span className="text-xs font-bold text-amber-700">{upcomingCount} Due Soon</span>
            </div>
          )}
        </div>
      </header>

      {/* Grid: Create Form & Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Create Form */}
        <div className="card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Add Recurring Entry</h3>
            <p className="text-xs text-text-secondary mt-0.5">Schedule autopay, subscriptions, EMIs</p>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Description</label>
              <input type="text" required placeholder="e.g. Netflix, Rent, Salary" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field w-full text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["expense","income"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => { setType(t); setCategory(t === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]); }}
                    className={`py-2.5 text-xs font-bold uppercase rounded-xl border transition-all ${type === t ? "btn-primary border-transparent" : "btn-secondary"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Amount (₹)</label>
                <input type="number" required placeholder="799" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field w-full text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-full text-sm">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Frequency</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value as typeof frequency)} className="input-field w-full text-sm">
                  {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Next Due</label>
                <input type="date" required value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} className="input-field w-full text-sm" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 btn-primary rounded-xl text-sm flex items-center justify-center gap-1.5">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Plus className="w-4 h-4" /> Add Recurring</>}
            </button>
          </form>
        </div>

        {/* Summary Panel */}
        <div className="card p-6 lg:col-span-2 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-text-primary font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-brand" /> Monthly Commitment Summary
            </div>
            <p className="text-xs text-text-secondary mt-0.5">Projected monthly totals from all active entries</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 py-2">
            {[
              { label: "Recurring Bills", value: formatINR(Math.round(totalMonthlyExpense)), icon: <ArrowDownRight className="w-3.5 h-3.5 text-accent-red" />, sub: "per month (est.)" },
              { label: "Recurring Income", value: formatINR(Math.round(totalMonthlyIncome)), icon: <ArrowUpRight className="w-3.5 h-3.5 text-accent-green" />, sub: "per month (est.)" },
              { label: "Active Entries", value: String(recurringItems.length), icon: null, sub: "scheduled" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider flex items-center gap-1">{stat.icon} {stat.label}</span>
                <div className="text-xl font-extrabold text-text-primary mt-1">{stat.value}</div>
                <span className="text-[10px] text-text-muted">{stat.sub}</span>
              </div>
            ))}
          </div>
          <div className="bg-brand-bg border border-purple-100 p-4 rounded-xl space-y-1">
            <div className="text-[10px] uppercase font-bold text-brand tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Automation Tip
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Use &quot;Mark as Paid&quot; to log a transaction to your ledger and auto-advance the due date.
            </p>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Scheduled Entries</h3>
        {recurringItems.length === 0 ? (
          <div className="py-16 text-center text-sm text-text-muted card">No recurring transactions. Add one above.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {recurringItems.map((item) => {
                const dueStatus = getDueStatus(item.nextDueDate);
                const isEditing = editId === item._id;
                const isPaying = payingId === item._id;
                return (
                  <motion.div key={item._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="card p-5 space-y-4 hover:shadow-hover transition-shadow">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-text-secondary uppercase">Description</label>
                          <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="input-field w-full text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-secondary uppercase">Amount</label>
                            <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="input-field w-full text-sm font-bold" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-secondary uppercase">Frequency</label>
                            <select value={editFrequency} onChange={(e) => setEditFrequency(e.target.value as typeof editFrequency)} className="input-field w-full text-sm">
                              {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-text-secondary uppercase">Next Due</label>
                          <input type="date" value={editNextDueDate} onChange={(e) => setEditNextDueDate(e.target.value)} className="input-field w-full text-sm" />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={handleSaveEdit} className="flex-1 py-2.5 btn-primary rounded-xl text-xs flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> Save</button>
                          <button onClick={() => setEditId(null)} className="btn-secondary px-3 py-2.5 text-xs rounded-xl"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-text-primary text-sm">{item.description}</h4>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] px-2 py-0.5 bg-page-bg text-text-secondary font-semibold rounded-lg border border-border">{item.category}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-page-bg text-text-muted font-medium rounded-lg border border-border">{getFrequencyLabel(item.frequency)}</span>
                            </div>
                          </div>
                          <span className={`text-base font-extrabold ${item.type === "income" ? "text-accent-green" : "text-accent-red"}`}>
                            {item.type === "income" ? "+" : "-"}{formatINR(item.amount)}
                          </span>
                        </div>
                        <div className={`p-3 rounded-xl border ${dueStatus.bg} flex items-center justify-between`}>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-3.5 h-3.5 ${dueStatus.color}`} />
                            <div>
                              <div className={`text-[11px] font-bold ${dueStatus.color}`}>{dueStatus.label}</div>
                              <div className="text-[10px] text-text-muted flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.nextDueDate}</div>
                            </div>
                          </div>
                          {item.type === "expense" && dueStatus.days <= 0 && <span className="w-2 h-2 bg-accent-red rounded-full animate-pulse" />}
                        </div>
                        <div className="pt-3 border-t border-border flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleStartEdit(item)} className="p-1.5 hover:bg-hover text-text-muted hover:text-text-primary rounded-lg transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-hover text-text-muted hover:text-accent-red rounded-lg transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          <button onClick={() => handleMarkAsPaid(item._id)} disabled={isPaying}
                            className="px-3.5 py-2 btn-primary rounded-xl text-[11px] flex items-center gap-1.5 disabled:opacity-40">
                            {isPaying ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Check className="w-3 h-3" /> Mark as Paid</>}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
