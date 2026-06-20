"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDashboard } from "@/context/dashboard-context";
import { Doc, Id } from "@/types";
import {
  Search,
  Trash2,
  Copy,
  Edit3,
  X,
  Download,
  Filter,
  Plus,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXPENSE_CATEGORIES = [
  "Food", "Groceries", "Rent", "Utilities", "Petrol", "Transport",
  "Shopping", "Entertainment", "Medical", "Education", "EMI",
  "Insurance", "Investments", "Miscellaneous"
];

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Interest", "Refund", "Gift", "Other"
];

const PAYMENT_METHODS = ["UPI", "Cash", "Credit Card", "Debit Card", "Bank Transfer"];

const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍕", Groceries: "🛒", Rent: "🏠", Utilities: "⚡", Petrol: "⛽",
  Transport: "🚗", Shopping: "🛍️", Entertainment: "🎬", Medical: "💊",
  Education: "📚", EMI: "🏦", Insurance: "🛡️", Investments: "📈",
  Salary: "💰", Freelance: "💻", Business: "🏢", Interest: "📊",
  Refund: "↩️", Gift: "🎁", Miscellaneous: "📋", Other: "📋",
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-purple-50", Groceries: "bg-green-50", Rent: "bg-blue-50",
  Utilities: "bg-yellow-50", Transport: "bg-orange-50", Shopping: "bg-pink-50",
  Entertainment: "bg-indigo-50", Salary: "bg-emerald-50",
};

export default function TransactionsLedger() {
  const { setAddTransactionOpen } = useDashboard();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");

  const deleteTransaction = useMutation(api.transactions.remove);
  const deleteMany = useMutation(api.transactions.removeMany);
  const createTransaction = useMutation(api.transactions.create);
  const updateTransaction = useMutation(api.transactions.update);

  const transactions = useQuery(api.transactions.list, {
    type: typeFilter || undefined,
    category: categoryFilter || undefined,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  }) || [];

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === "date_desc") return b.date.localeCompare(a.date);
    if (sortBy === "date_asc") return a.date.localeCompare(b.date);
    if (sortBy === "amount_desc") return b.amount - a.amount;
    if (sortBy === "amount_asc") return a.amount - b.amount;
    return 0;
  });

  const [selectedIds, setSelectedIds] = useState<Id<"transactions">[]>([]);
  const [editId, setEditId] = useState<Id<"transactions"> | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"expense" | "income">("expense");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");

  const handleSelectRow = (id: Id<"transactions">) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === sortedTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedTransactions.map((tx) => tx._id));
    }
  };

  const handleDeleteSingle = async (id: Id<"transactions">) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction({ id });
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected transactions?`)) {
      await deleteMany({ ids: selectedIds });
      setSelectedIds([]);
    }
  };

  const handleDuplicate = async (tx: Doc<"transactions">) => {
    try {
      await createTransaction({
        amount: tx.amount, type: tx.type, category: tx.category,
        date: new Date().toISOString().split("T")[0], time: tx.time,
        notes: `${tx.notes || ""} (Duplicate)`, tags: tx.tags, paymentMethod: tx.paymentMethod,
      });
    } catch (e) { console.error(e); alert("Failed to duplicate transaction"); }
  };

  const handleOpenEdit = (tx: Doc<"transactions">) => {
    setEditId(tx._id); setEditAmount(String(tx.amount)); setEditType(tx.type);
    setEditCategory(tx.category); setEditDate(tx.date); setEditTime(tx.time || "");
    setEditNotes(tx.notes || ""); setEditPaymentMethod(tx.paymentMethod);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !editAmount || isNaN(Number(editAmount))) return;
    try {
      await updateTransaction({
        id: editId, amount: Number(editAmount), type: editType,
        category: editCategory, date: editDate, time: editTime || undefined,
        notes: editNotes || undefined, paymentMethod: editPaymentMethod,
      });
      setEditId(null);
    } catch (err) { console.error(err); alert("Failed to save changes"); }
  };

  const exportToCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["Date", "Type", "Category", "Amount (INR)", "Payment Method", "Notes", "Tags"];
    const rows = transactions.map((t) => [
      t.date, t.type.toUpperCase(), t.category, t.amount, t.paymentMethod, t.notes || "", t.tags?.join(", ") || "",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `MoneyMap_Transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const formatINR = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Transactions</h1>
          <p className="text-sm text-text-secondary mt-0.5">Complete financial ledger</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={exportToCSV} disabled={transactions.length === 0} className="btn-secondary px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-40">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => setAddTransactionOpen(true)} className="btn-primary px-4 py-2.5 text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Transaction
          </button>
        </div>
      </header>

      {/* Filter Chips Row */}
      <div className="flex flex-wrap items-center gap-2">
        {["", "income", "expense"].map((t) => (
          <button
            key={t || "all"}
            onClick={() => { setTypeFilter(t); setCategoryFilter(""); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === t ? "btn-primary shadow-sm" : "btn-secondary"
            }`}
          >
            {t === "" ? "All" : t === "income" ? "Income" : "Expense"}
          </button>
        ))}
        {["Food", "Shopping", "Transport", "Bills", "Entertainment"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(categoryFilter === cat ? "" : cat)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === cat ? "bg-brand/10 text-brand border border-brand/20" : "btn-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters Card */}
      <section className="card p-5 space-y-4">
        <div className="flex items-center gap-1.5 text-text-secondary font-semibold text-xs uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-text-muted" /> Filters & Search
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pl-10 text-sm" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field text-sm">
            <option value="">All Categories</option>
            {(typeFilter === "expense" ? EXPENSE_CATEGORIES : typeFilter === "income" ? INCOME_CATEGORIES : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="input-field text-sm">
            <option value="">All Methods</option>
            {PAYMENT_METHODS.map((pm) => <option key={pm} value={pm}>{pm}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="input-field text-sm">
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted font-medium shrink-0">From</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field w-full text-sm" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted font-medium shrink-0">To</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field w-full text-sm" />
          </div>
        </div>
      </section>

      {/* Bulk Delete Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="p-4 bg-brand text-white rounded-2xl flex items-center justify-between shadow-lg">
            <span className="text-sm font-semibold">{selectedIds.length} rows selected</span>
            <button onClick={handleBulkDelete} className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <section className="card overflow-hidden">
        {transactions.length === 0 ? (
          <div className="py-20 text-center text-sm text-text-muted">
            No matching transactions found. Try adjusting filters or create a new transaction.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-hover text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4 w-10 text-center">
                    <input type="checkbox" checked={selectedIds.length === sortedTransactions.length && transactions.length > 0}
                      onChange={handleSelectAll} className="rounded border-border text-brand focus:ring-brand cursor-pointer" />
                  </th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Method</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedTransactions.map((tx) => {
                  const isChecked = selectedIds.includes(tx._id);
                  return (
                    <tr key={tx._id} className={`hover:bg-hover-row transition-colors ${isChecked ? "bg-brand/[0.03]" : ""}`}>
                      <td className="p-4 text-center">
                        <input type="checkbox" checked={isChecked} onChange={() => handleSelectRow(tx._id)}
                          className="rounded border-border text-brand focus:ring-brand cursor-pointer" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${CATEGORY_COLORS[tx.category] || "bg-slate-50"}`}>
                            {CATEGORY_ICONS[tx.category] || "📋"}
                          </span>
                          <span className="font-semibold text-text-primary">{tx.category}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary truncate max-w-[180px]">{tx.notes || "—"}</td>
                      <td className="p-4 text-text-secondary">{tx.date}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-page-bg text-text-secondary font-medium text-[11px] rounded-lg border border-border">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-bold ${tx.type === "income" ? "text-accent-green" : "text-accent-red"}`}>
                        {tx.type === "income" ? "+" : "-"}{formatINR(tx.amount)}
                      </td>
                      <td className="p-4 text-center flex items-center justify-center gap-1">
                        <button onClick={() => handleDuplicate(tx)} title="Duplicate" className="p-1.5 hover:bg-hover text-text-muted hover:text-text-primary rounded-lg transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleOpenEdit(tx)} title="Edit" className="p-1.5 hover:bg-hover text-text-muted hover:text-text-primary rounded-lg transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteSingle(tx._id)} title="Delete" className="p-1.5 hover:bg-hover text-text-muted hover:text-accent-red rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      <AnimatePresence>
        {editId && (
          <>
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setEditId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md card p-6 z-50 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-text-primary text-base">Edit Transaction</h3>
                <button onClick={() => setEditId(null)} className="p-1.5 hover:bg-hover text-text-muted hover:text-text-primary rounded-full"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(["expense", "income"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => { setEditType(t); setEditCategory(t === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]); }}
                      className={`py-2.5 text-sm font-semibold rounded-xl border transition-all ${editType === t ? "btn-primary border-transparent" : "btn-secondary"}`}>
                      {t === "expense" ? "Expense" : "Income"}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase">Amount (₹)</label>
                  <input type="number" required value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="input-field w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Category</label>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="input-field w-full text-sm">
                      {(editType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Method</label>
                    <select value={editPaymentMethod} onChange={(e) => setEditPaymentMethod(e.target.value)} className="input-field w-full text-sm">
                      {PAYMENT_METHODS.map((pm) => <option key={pm} value={pm}>{pm}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Date</label>
                    <input type="date" required value={editDate} onChange={(e) => setEditDate(e.target.value)} className="input-field w-full text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Time</label>
                    <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="input-field w-full text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase">Notes</label>
                  <textarea rows={2} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="input-field w-full resize-none text-sm" />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditId(null)} className="btn-secondary px-4 py-2.5 text-sm">Cancel</button>
                  <button type="submit" className="btn-primary px-5 py-2.5 text-sm">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
