"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { useMutation } from "@/hooks/use-convex";
import { api } from "../../../convex/_generated/api";
import {
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShieldCheck
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // Auth Mode: "signin" | "signup"
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  // Google Accounts Chooser States
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [googleError, setGoogleError] = useState("");

  // Convex mutations
  const signInMutation = useMutation(api.users.signIn);
  const signUpMutation = useMutation(api.users.signUp);
  const oauthSignInMutation = useMutation(api.users.oauthSignIn);

  // Redirect if user already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("moneymap_user");
      if (saved) {
        router.push("/dashboard");
      }
    }
  }, [router]);

  // Form submission handler (manual signup/signin)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Input validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setStatus("loading");
    try {
      let result;
      if (mode === "signin") {
        result = await signInMutation({ email, password });
      } else {
        result = await signUpMutation({ name, email, password });
      }

      if (result && result.id) {
        // Save user session in localStorage
        localStorage.setItem("moneymap_user", JSON.stringify(result));
        
        // Notify other hooks to refresh their active user
        window.dispatchEvent(new Event("moneymap_auth_change"));
        
        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        throw new Error("Authentication failed. Please try again.");
      }
    } catch (err: any) {
      setStatus("idle");
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  // Google authentication helper
  const handleGoogleSignIn = async (gName: string, gEmail: string) => {
    setGoogleError("");
    setStatus("loading");
    try {
      const result = await oauthSignInMutation({
        name: gName,
        email: gEmail,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${gName}`,
        tokenIdentifier: `google-oauth-${gEmail.replace(/[^a-zA-Z0-9]/g, "-")}`,
      });

      if (result && result.id) {
        localStorage.setItem("moneymap_user", JSON.stringify(result));
        window.dispatchEvent(new Event("moneymap_auth_change"));
        
        setStatus("success");
        setShowGoogleChooser(false);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        throw new Error("Google registration failed. Please try again.");
      }
    } catch (err: any) {
      setStatus("idle");
      setGoogleError(err.message || "Could not register with Google.");
    }
  };

  // Helper for quick guest access
  const handleGuestAccess = () => {
    const guestUser = {
      id: "guest_user",
      name: "Sahil Verma",
      email: "guest@moneymap.in"
    };
    localStorage.setItem("moneymap_user", JSON.stringify(guestUser));
    window.dispatchEvent(new Event("moneymap_auth_change"));
    
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    }, 800);
  };

  const handleModeToggle = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-page-bg flex select-none overflow-x-hidden font-sans">
      
      {/* Back button floating */}
      <div className="absolute top-6 right-6 z-30">
        <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-secondary hover:text-[#111111] bg-white border border-border rounded-lg shadow-sm transition-all">
          ← Back to landing
        </Link>
      </div>

      {/* LEFT SIDE: Minimalist brand quote block (Restrained, Editorial) */}
      <div className="hidden lg:flex w-[45%] bg-[#0F172A] p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Content top: Simple Typographic Quote */}
        <div className="relative z-10 space-y-6 pt-10">
          <blockquote className="space-y-4">
            <p className="text-xl md:text-2xl font-normal text-white/90 leading-relaxed italic font-serif">
              &ldquo;Do not save what is left after spending, but spend what is left after saving.&rdquo;
            </p>
            <cite className="block text-xs font-bold text-[#3B82F6] not-italic uppercase tracking-widest">— Warren Buffett</cite>
          </blockquote>
        </div>

        {/* Content middle: Flat browser screenshot mockup preview */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-[320px] bg-slate-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden opacity-90">
            <div className="bg-slate-800 px-3 py-2 flex items-center gap-1.5 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
            <div className="p-4 space-y-3.5 text-left bg-slate-950 font-mono text-[9px] text-white/40">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/80">Asset Ledger</span>
                <span className="text-[#3B82F6]">Live Sandbox</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Index Fund</span>
                  <span className="text-white/80">₹38,20,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Fund</span>
                  <span className="text-white/80">₹4,50,000</span>
                </div>
                <div className="flex justify-between text-white/80 font-bold border-t border-white/5 pt-1.5">
                  <span>Net Assets</span>
                  <span className="text-[#059669]">₹42,70,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content bottom */}
        <div className="relative z-10 max-w-sm space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
            Understand every rupee.
          </h2>
          <p className="text-xs text-white/50 leading-relaxed">
            Consolidate your spending, savings, investments, and net worth into one unified ledger in sandbox isolation.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-[10px] pt-4 font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
            <span>Sandboxed Local Storage Protection</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive clean authentication form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 relative z-10 bg-page-bg">
        
        {/* Form Container */}
        <div className="mx-auto w-full max-w-md">
          
          {/* Logo Header */}
          <div className="flex justify-start mb-6">
            <Link href="/">
              <Logo iconClassName="w-8 h-8" textClassName="font-semibold text-base tracking-tight text-[#111111]" />
            </Link>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg border border-border shadow-sm">
            
            {/* Page Headers */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[#111111] tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-xs text-text-secondary mt-1 font-medium">
                {mode === "signin" 
                  ? "Enter your credentials to access your financial operating system" 
                  : "Register to begin tracking and organizing your wealth"
                }
              </p>
            </div>

            {/* Main Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Name (Sign Up only) */}
              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label htmlFor="name" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input 
                        id="name" 
                        name="name" 
                        type="text" 
                        required={mode === "signup"}
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sahil Verma"
                        className="input-field w-full pl-10 text-xs py-2.5" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sahil@example.com"
                    className="input-field w-full pl-10 text-xs py-2.5" 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Password</label>
                  {mode === "signin" && (
                    <button type="button" className="text-[10px] font-semibold text-brand hover:text-brand-light transition-colors uppercase tracking-wider">Forgot Password?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    required
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full pl-10 pr-10 text-xs py-2.5" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up only) */}
              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label htmlFor="confirmPassword" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type={showPassword ? "text" : "password"} 
                        required={mode === "signup"}
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field w-full pl-10 pr-10 text-xs py-2.5" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember me (Sign in only) */}
              {mode === "signin" && (
                <div className="flex items-center gap-2 pt-0.5">
                  <input type="checkbox" id="remember" defaultChecked className="rounded border-border text-brand focus:ring-brand cursor-pointer" />
                  <label htmlFor="remember" className="text-[11px] text-text-secondary font-medium cursor-pointer">Remember me on this device</label>
                </div>
              )}

              {/* Error Box */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-100 text-accent-red rounded-lg flex items-start gap-2.5 text-xs font-semibold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> 
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={status !== "idle"}
                className="w-full py-2.5 btn-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-70 mt-2 cursor-pointer"
              >
                {status === "loading" ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : status === "success" ? (
                  <><Check className="w-4 h-4" /> Redirecting...</>
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Sign Up"} 
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="flex-1 h-px bg-border/80" />
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-border/80" />
            </div>

            {/* Alternative auth options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button 
                type="button" 
                onClick={handleGuestAccess}
                className="btn-secondary py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand" /> Guest Access
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowGoogleChooser(true);
                  setGoogleError("");
                }}
                className="btn-secondary py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
            </div>

            {/* Toggle Sign In / Sign Up Link */}
            <div className="mt-6 text-center text-xs">
              <span className="text-text-secondary">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                type="button" 
                onClick={handleModeToggle}
                className="text-brand font-semibold hover:text-[#0043CE] transition-colors"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Google Sign In Accounts Chooser Modal */}
      <AnimatePresence>
        {showGoogleChooser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg border border-border shadow-float p-6 w-full max-w-sm space-y-5 mx-4"
            >
              {/* Header */}
              <div className="text-center space-y-1.5">
                <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <h3 className="text-sm font-bold text-[#111111] tracking-tight">Sign in with Google</h3>
                <p className="text-[10px] text-text-secondary">to continue to MoneyMap</p>
              </div>

              {/* Suggestions */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {[
                  { name: "Sahil Verma", email: "sahil.verma@gmail.com" },
                  { name: "Priya Sharma", email: "priya.sharma@gmail.com" },
                  { name: "Rohan Gupta", email: "rohan.gupta@gmail.com" }
                ].map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleGoogleSignIn(account.name, account.email)}
                    disabled={status === "loading"}
                    className="w-full flex items-center gap-3 p-2.5 rounded border border-border bg-[#FAFAF8]/50 hover:bg-[#FAFAF8] text-left transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[10px] uppercase">
                      {account.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#111111] truncate">{account.name}</p>
                      <p className="text-[10px] text-text-muted truncate">{account.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Or Custom Credentials */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-x-0 h-px bg-border" />
                <span className="relative bg-white px-2.5 text-[9px] text-text-muted font-bold uppercase tracking-wider">or custom account</span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Amit Sen)"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="input-field w-full text-xs py-2 px-3"
                  disabled={status === "loading"}
                />
                <input
                  type="email"
                  placeholder="Email (e.g. amit@gmail.com)"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="input-field w-full text-xs py-2 px-3"
                  disabled={status === "loading"}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customGoogleName.trim() || !customGoogleEmail.includes("@")) {
                      setGoogleError("Please enter a valid name and email address.");
                      return;
                    }
                    handleGoogleSignIn(customGoogleName.trim(), customGoogleEmail.trim());
                  }}
                  disabled={status === "loading"}
                  className="w-full py-2 btn-primary rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {status === "loading" ? "Connecting..." : "Continue"}
                </button>
              </div>

              {/* Error messages */}
              {googleError && (
                <div className="p-2.5 bg-red-50 border border-red-100 text-accent-red rounded text-[11px] font-semibold flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{googleError}</span>
                </div>
              )}

              {/* Cancel footer */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoogleChooser(false);
                    setGoogleError("");
                  }}
                  disabled={status === "loading"}
                  className="text-xs font-semibold text-text-secondary hover:text-[#111111] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
