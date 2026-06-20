"use client";

import React, { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useDashboard } from "@/context/dashboard-context";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, X, Sparkles, Tag, Plus, Receipt, Check, FileText } from "lucide-react";

const EXPENSE_CATEGORIES = [
  "Food", "Groceries", "Rent", "Utilities", "Petrol", "Transport",
  "Shopping", "Entertainment", "Medical", "Education", "EMI",
  "Insurance", "Investments", "Miscellaneous"
];

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Interest", "Refund", "Gift", "Other"
];

const PAYMENT_METHODS = ["UPI", "Cash", "Credit Card", "Debit Card", "Bank Transfer"];

export default function AddTransactionDrawer() {
  const { isAddTransactionOpen, setAddTransactionOpen } = useDashboard();

  return (
    <AnimatePresence>
      {isAddTransactionOpen && (
        <AddTransactionForm onClose={() => setAddTransactionOpen(false)} />
      )}
    </AnimatePresence>
  );
}

interface AddTransactionFormProps {
  onClose: () => void;
}

function AddTransactionForm({ onClose }: AddTransactionFormProps) {
  const createTransaction = useMutation(api.transactions.create);
  const parseNLP = useAction(api.ai.parseTransaction);

  const [nlpText, setNlpText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [nlpSuccess, setNlpSuccess] = useState<boolean | null>(null);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  const [notes, setNotes] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType: "expense" | "income") => {
    setType(newType);
    setCategory(newType === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleNlpParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlpText.trim()) return;
    setIsParsing(true); setNlpSuccess(null);
    try {
      const result = await parseNLP({ text: nlpText });
      setAmount(String(result.amount)); setType(result.type as "expense" | "income");
      setCategory(result.category); setDate(result.date); setNlpSuccess(true);
    } catch (err) { console.error(err); setNlpSuccess(false); }
    finally { setIsParsing(false); }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => setTags(tags.filter((t) => t !== tagToRemove));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { alert("Please enter a valid amount"); return; }
    setIsSubmitting(true);
    try {
      await createTransaction({
        amount: Number(amount), type, category, date,
        time: time || undefined, notes: notes || undefined,
        tags: tags.length > 0 ? tags : undefined, paymentMethod,
        receiptUrl: receiptName ? `/uploads/${receiptName}` : undefined,
      });
      onClose();
    } catch (err) { console.error(err); alert("Failed to save transaction."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 z-50 bg-black" />

      {/* Drawer */}
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] md:max-h-[85vh] bg-card rounded-t-[24px] border-t border-border flex flex-col shadow-float overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Add Transaction</h2>
            <p className="text-xs text-text-muted">Record a new income or expense</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-hover text-text-muted hover:text-text-primary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full">
          {/* NLP Section */}
          <div className="bg-gradient-to-br from-[#F5F3FF] via-[#EEF2FF] to-[#F0F9FF] border border-purple-100 rounded-[18px] p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-brand font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AI Natural Language
            </div>
            <form onSubmit={handleNlpParse} className="flex gap-2">
              <input type="text" value={nlpText} onChange={(e) => setNlpText(e.target.value)}
                placeholder="e.g., Spent 220 on pizza with Rahul today" disabled={isParsing}
                className="input-field flex-1 text-sm disabled:opacity-50" />
              <button type="submit" disabled={isParsing || !nlpText.trim()}
                className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1.5 disabled:opacity-40 shrink-0">
                {isParsing ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Parse"}
              </button>
            </form>
            {nlpSuccess === true && (
              <div className="text-xs text-accent-green font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Auto-filled successfully!
              </div>
            )}
            {nlpSuccess === false && (
              <div className="text-xs text-accent-red font-medium">⚠️ Parsing failed. Enter details manually below.</div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-3">
              {(["expense", "income"] as const).map((t) => (
                <button key={t} type="button" onClick={() => handleTypeChange(t)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    type === t ? "btn-primary border-transparent" : "btn-secondary"
                  }`}>
                  {t === "expense" ? "Expense (Outflow)" : "Income (Inflow)"}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-text-muted">₹</span>
                <input type="number" required placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="input-field w-full pl-9 text-lg font-extrabold" />
              </div>
            </div>

            {/* Category & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-full text-sm">
                  {(type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field w-full text-sm">
                  {PAYMENT_METHODS.map((pm) => <option key={pm} value={pm}>{pm}</option>)}
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input-field w-full pl-11 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase">Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field w-full pl-11 text-sm" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Notes</label>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter details..." className="input-field w-full resize-none text-sm" />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-bg border border-purple-100 text-brand text-xs font-medium rounded-lg">
                    <Tag className="w-3 h-3" /> {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-brand/60 hover:text-brand"><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag}
                placeholder="Type tag and press Enter..." className="input-field w-full text-xs" />
            </div>

            {/* Receipt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Receipt Attachment</label>
              <div onClick={() => {
                const mockFiles = ["receipt_uber.jpg", "grocery_bill_june.png", "amazon_invoice.pdf"];
                setReceiptName(mockFiles[Math.floor(Math.random() * mockFiles.length)]);
              }}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  receiptName ? "border-green-200 bg-green-50/50 text-accent-green" : "border-border bg-page-bg hover:bg-hover hover:border-text-muted text-text-muted"
                }`}>
                {receiptName ? (
                  <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <FileText className="w-5 h-5 text-accent-green" /> <span>{receiptName} Attached</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setReceiptName(null); }} className="p-1 hover:bg-green-100 text-accent-green rounded-full">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Receipt className="w-6 h-6 mx-auto text-text-muted" />
                    <div className="text-xs font-medium text-text-secondary">Click to upload receipt</div>
                    <div className="text-[10px] text-text-muted">JPG, PNG, PDF (Up to 5MB)</div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button type="submit" disabled={isSubmitting}
                className="w-full py-3.5 btn-primary rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40">
                {isSubmitting ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><Plus className="w-4 h-4" /> Save Transaction</>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
