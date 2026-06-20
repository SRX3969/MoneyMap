"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@/hooks/use-convex";
import { api } from "../../../../convex/_generated/api";
import { Settings, Trash2, Check, User, CreditCard, Shield, Bell, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileSettingsView() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiSeverity, setAiSeverity] = useState("high");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("moneymap_user");
      return saved ? JSON.parse(saved) : { name: "Sahil Verma", email: "sahil@moneymap.in" };
    }
    return { name: "Sahil Verma", email: "sahil@moneymap.in" };
  });

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleSignOut = () => {
    localStorage.removeItem("moneymap_user");
    window.dispatchEvent(new Event("moneymap_auth_change"));
    router.push("/login");
  };

  const clearChatHistory = useMutation(api.ai.clearChatHistory);
  const clearTransactions = useMutation(api.transactions.removeMany);
  const transactions = useQuery(api.transactions.list, {}) || [];
  const budgets = useQuery(api.budgets.list, {}) || [];
  const removeBudget = useMutation(api.budgets.remove);
  const goals = useQuery(api.goals.list) || [];
  const removeGoal = useMutation(api.goals.remove);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await clearChatHistory();
      for (const b of budgets) await removeBudget({ id: b._id });
      for (const g of goals) await removeGoal({ id: g._id });
      const txIds = transactions.map((t: any) => t._id);
      if (txIds.length > 0) await clearTransactions({ ids: txIds });
      alert("Workspace reset successfully!");
      setShowResetConfirm(false);
    } catch (e) { console.error(e); alert("Failed to reset workspace"); }
    finally { setIsResetting(false); }
  };

  const menuItems = [
    { icon: User, label: "Personal Information", desc: "Name, email, avatar" },
    { icon: CreditCard, label: "Payment Methods", desc: "UPI, Cards, Bank accounts" },
    { icon: Bell, label: "Notifications", desc: "Alerts, reminders, reports" },
    { icon: Shield, label: "Security", desc: "Password, 2FA, sessions" },
    { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact, feedback" },
  ];

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Profile & Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage your account and preferences</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* User Card */}
        <div className="card p-6 space-y-5 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand to-brand-light text-white flex items-center justify-center font-bold text-xl shadow-lg">
            {getInitials(currentUser.name)}
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-base">{currentUser.name}</h3>
            <p className="text-xs text-text-muted mt-0.5">{currentUser.email}</p>
          </div>
          <span className="px-3 py-1 bg-brand-bg text-brand text-[10px] font-bold rounded-full border border-purple-100 uppercase tracking-wider">
            Premium Plan
          </span>

          <button 
            onClick={handleSignOut}
            className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-text-primary font-bold text-xs rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4 text-text-secondary" />
            <span>Sign Out</span>
          </button>

          <div className="w-full pt-4 border-t border-border grid grid-cols-2 gap-3 text-left">
            <div>
              <span className="text-[10px] text-text-muted font-semibold uppercase">Plan</span>
              <p className="font-bold text-text-primary text-xs">Premium</p>
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-semibold uppercase">Currency</span>
              <p className="font-bold text-text-primary text-xs">INR (₹)</p>
            </div>
          </div>
        </div>

        {/* Settings & Menu */}
        <div className="md:col-span-2 space-y-5">
          {/* Quick Menu */}
          <div className="card p-1 space-y-0.5">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={i} className="w-full flex items-center gap-4 p-4 rounded-[16px] hover:bg-hover-row transition-colors text-left group">
                  <div className="w-10 h-10 rounded-xl bg-page-bg border border-border flex items-center justify-center group-hover:bg-brand-bg group-hover:border-purple-100 transition-colors">
                    <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-brand transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary">{item.label}</h4>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preferences */}
          <div className="card p-6 space-y-5">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-text-muted" /> System Preferences
            </h3>

            <div className="space-y-4">
              {/* Notification toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">Smart Alerts</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Budget warnings & spending alerts</p>
                </div>
                <button onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notificationsEnabled ? "bg-brand" : "bg-border"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notificationsEnabled ? "left-6" : "left-1"}`} />
                </button>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">Theme</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Premium light fintech aesthetic</p>
                </div>
                <span className="px-2.5 py-1 bg-green-50 text-accent-green text-[10px] font-bold rounded-lg flex items-center gap-1 border border-green-100">
                  <Check className="w-3 h-3" /> Active
                </span>
              </div>

              {/* AI Severity */}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">SHYN AI Severity</h4>
                  <p className="text-xs text-text-secondary mt-0.5">How strict should recommendations be</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["minimal", "medium", "high"].map((level) => (
                    <button key={level} onClick={() => setAiSeverity(level)}
                      className={`py-2.5 text-xs font-bold uppercase rounded-xl border transition-all ${
                        aiSeverity === level ? "btn-primary border-transparent" : "btn-secondary"
                      }`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-[20px] p-6 bg-red-50/50 border border-red-200 space-y-4">
            <div className="flex items-start gap-3 text-accent-red">
              <Trash2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold">Danger Zone: Reset Workspace</h3>
                <p className="text-xs text-red-600/70 leading-relaxed">
                  Permanently clear all transactions, budgets, goals, and AI conversations. This action is irreversible.
                </p>
              </div>
            </div>
            {!showResetConfirm ? (
              <button onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 bg-accent-red hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                Reset Database
              </button>
            ) : (
              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleResetData} disabled={isResetting}
                  className="px-4 py-2.5 bg-accent-red hover:bg-red-600 disabled:bg-red-200 text-white font-bold text-xs rounded-xl transition-all">
                  {isResetting ? "Resetting..." : "Yes, Delete Everything"}
                </button>
                <button onClick={() => setShowResetConfirm(false)} disabled={isResetting}
                  className="btn-secondary px-4 py-2.5 text-xs">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
