"use client";

import React, { useState } from "react";
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
  
  // 3D tilt states for visual effects
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rX = -(mouseY / height) * 15;
    const rY = (mouseX / width) * 15;
    setTiltX(rX);
    setTiltY(rY);
  };

  const handleTiltLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

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

  // Convex mutations
  const signInMutation = useMutation(api.users.signIn);
  const signUpMutation = useMutation(api.users.signUp);

  // Form submission handler
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

  // Helper for quick guest access
  const handleGuestAccess = () => {
    // Generate a permanent guest session if not already stored
    const guestUser = {
      id: "guest_user",
      name: "Sahil Verma (Guest)",
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
    }, 1000);
  };

  const handleModeToggle = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-white flex select-none overflow-x-hidden font-sans">
      
      {/* Back button floating */}
      <div className="absolute top-6 right-6 z-30">
        <Link href="/" className="group inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary bg-card/85 backdrop-blur-md hover:bg-hover border border-border rounded-full shadow-sm transition-all">
          ← Back to landing
        </Link>
      </div>

      {/* LEFT SIDE: Branded premium card layout (Inspired by Reference) */}
      <div className="hidden lg:flex w-[48%] bg-slate-950 p-8 flex-col justify-between relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff05_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

        {/* Abstract Glowing Waves Visual in MoneyMap Colors */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[70%] aspect-square rounded-full bg-brand/25 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full bg-cyan-500/15 blur-[130px] animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[30%] left-[20%] w-[50%] aspect-square rounded-full bg-pink-500/10 blur-[140px]" />
          
          {/* Subtle animated path overlay */}
          <svg className="absolute bottom-0 left-0 w-full h-[60%] opacity-30" viewBox="0 0 500 500" fill="none" preserveAspectRatio="none">
            <path d="M 0 350 Q 125 150 250 280 T 500 120 L 500 500 L 0 500 Z" fill="url(#waveGrad)" />
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0B1528" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Content top: Glassmorphic Quote Card */}
        <div className="relative z-10 bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
            <Sparkles className="w-3 h-3 text-brand" />
            <span className="text-[10px] uppercase tracking-widest text-brand font-bold">A Wise Quote</span>
          </div>
          
          <blockquote className="space-y-3">
            <p className="text-lg md:text-xl font-medium text-white/95 leading-relaxed font-serif italic">
              &ldquo;Do not save what is left after spending, but spend what is left after saving.&rdquo;
            </p>
            <cite className="block text-xs font-bold text-brand-light not-italic uppercase tracking-widest">— Warren Buffett</cite>
          </blockquote>
        </div>

        {/* Content middle: 3D Floating Mockup Card with Mouse Tilt Interaction */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-6 min-h-[300px]">
          <motion.div
            onMouseMove={handleTiltMove}
            onMouseLeave={handleTiltLeave}
            animate={{ 
              rotateX: tiltX, 
              rotateY: tiltY,
              y: [0, -8, 0] 
            }}
            transition={{
              rotateX: { type: "spring", stiffness: 250, damping: 20 },
              rotateY: { type: "spring", stiffness: 250, damping: 20 },
              y: { 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatType: "reverse"
              }
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full max-w-[340px] aspect-[4/3] relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-slate-900/60 group cursor-pointer"
          >
            {/* Ambient inner glow */}
            <div className="absolute -inset-10 bg-gradient-to-br from-brand/20 to-cyan-500/20 blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
            
            {/* The 3D login illustration */}
            <img 
              src="/login_graphic.png" 
              alt="MoneyMap 3D Finance Illustration" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] select-none pointer-events-none"
              style={{ transform: "translateZ(30px)" }}
            />
            
            {/* Sweeping reflection sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          </motion.div>
        </div>

        {/* Content bottom */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Map Every Rupee.<br />Build Wealth.
          </h2>
          <p className="mt-3 text-sm text-white/50 leading-relaxed">
            Take complete control of your finances, budget intelligently, and let SHYN AI guide you to financial freedom. Join thousands of users today.
          </p>
          <div className="mt-6 flex items-center gap-3 text-white/30 text-xs">
            <ShieldCheck className="w-5 h-5 text-brand" />
            <span>End-to-end encrypted local sandbox security</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive clean authentication form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 relative z-10 bg-slate-50/50">
        
        {/* Form Container */}
        <div className="mx-auto w-full max-w-md">
          
          {/* Logo Header */}
          <div className="flex justify-start mb-8">
            <Link href="/">
              <Logo iconClassName="w-9 h-9" textClassName="font-extrabold text-lg tracking-tight text-text-primary" />
            </Link>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-border shadow-float">
            
            {/* Page Headers */}
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
                {mode === "signin" ? "Welcome Back! 👋" : "Create your Account ✨"}
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {mode === "signin" 
                  ? "Enter your email and password to access your account" 
                  : "Sign up to start tracking and building wealth"
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
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label htmlFor="name" className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input 
                        id="name" 
                        name="name" 
                        type="text" 
                        required={mode === "signup"}
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sahil Verma"
                        className="input-field w-full pl-icon-left text-sm py-3" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sahil@example.com"
                    className="input-field w-full pl-icon-left text-sm py-3" 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Password</label>
                  {mode === "signin" && (
                    <button type="button" className="text-xs font-bold text-brand hover:text-brand-light transition-colors">Forgot Password?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    required
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full pl-icon-left pr-icon-right text-sm py-3" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label htmlFor="confirmPassword" className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type={showPassword ? "text" : "password"} 
                        required={mode === "signup"}
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field w-full pl-icon-left pr-icon-right text-sm py-3" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember me (Sign in only) */}
              {mode === "signin" && (
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="remember" defaultChecked className="rounded border-border text-brand focus:ring-brand cursor-pointer" />
                  <label htmlFor="remember" className="text-xs text-text-secondary font-medium cursor-pointer">Remember me on this device</label>
                </div>
              )}

              {/* Error Box */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 text-accent-red rounded-xl flex items-start gap-2.5 text-xs font-semibold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> 
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={status !== "idle"}
                className="w-full py-3.5 btn-primary rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {status === "loading" ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : status === "success" ? (
                  <><Check className="w-5 h-5" /> Successful!</>
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Sign Up"} 
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Alternative auth options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={handleGuestAccess}
                className="btn-secondary py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-brand" /> Guest Access
              </button>
              <button 
                type="button" 
                onClick={handleGuestAccess}
                className="btn-secondary py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
            </div>

            {/* Toggle Sign In / Sign Up Link */}
            <div className="mt-8 text-center text-xs">
              <span className="text-text-muted">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                type="button" 
                onClick={handleModeToggle}
                className="text-brand font-bold hover:text-brand-light transition-colors"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
}
