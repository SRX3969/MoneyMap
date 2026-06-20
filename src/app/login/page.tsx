"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Sparkles, ArrowRight, Check, AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!email || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setStatus("loading");
    setTimeout(() => { setStatus("success"); setTimeout(() => router.push("/dashboard"), 1000); }, 1500);
  };

  const handleGuestAccess = () => {
    setEmail("guest@moneymap.in"); setPassword("password123"); setError("");
    setStatus("loading");
    setTimeout(() => { setStatus("success"); setTimeout(() => router.push("/dashboard"), 1000); }, 1200);
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-brand/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] aspect-square rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none" />

      {/* Back link */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary bg-card hover:bg-hover border border-border rounded-full shadow-sm transition-all">
          ← Back to landing
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-brand to-brand-light text-white rounded-xl shadow-[0_0_16px_rgba(124,58,237,0.25)]">
              <Compass className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-text-primary">MoneyMap</span>
          </Link>
        </motion.div>

        {/* Auth Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="card py-8 px-6 sm:px-10 shadow-card">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Welcome Back! 👋</h2>
            <p className="text-sm text-text-secondary mt-1">Sign in to continue your financial journey</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="email" name="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="sahil@example.com"
                  className="input-field w-full pl-11 text-sm" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-semibold text-brand hover:text-brand-light transition-colors">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field w-full pl-11 pr-12 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-border text-brand focus:ring-brand cursor-pointer" />
              <span className="text-xs text-text-secondary font-medium">Remember me</span>
            </div>

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 text-accent-red rounded-xl flex items-start gap-2 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button type="submit" disabled={status !== "idle"}
              className="w-full py-3.5 btn-primary rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70">
              {status === "loading" ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : status === "success" ? (
                <><Check className="w-5 h-5" /> Welcome!</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted font-medium">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={handleGuestAccess}
              className="btn-secondary py-3 rounded-xl text-xs flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" /> Guest Access
            </button>
            <button type="button" onClick={handleGuestAccess}
              className="btn-secondary py-3 rounded-xl text-xs flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-xs text-text-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/dashboard" className="text-brand font-semibold hover:text-brand-light transition-colors">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
