"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/context/dashboard-context";
import { Logo } from "@/components/ui/logo";
import {
  Home,
  Calendar,
  FileText,
  PieChart,
  Target,
  BarChart3,
  RefreshCw,
  Sparkles,
  Settings,
  User,
  Plus
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: null,
    items: [
      { label: "Dashboard", path: "/dashboard", icon: Home },
      { label: "Calendar", path: "/dashboard/calendar", icon: Calendar },
      { label: "Transactions", path: "/dashboard/transactions", icon: FileText },
    ],
  },
  {
    title: "PLANNING",
    items: [
      { label: "Budgets", path: "/dashboard/budgets", icon: PieChart },
      { label: "Goals", path: "/dashboard/goals", icon: Target },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { label: "Reports", path: "/dashboard/reports", icon: BarChart3 },
      { label: "Recurring", path: "/dashboard/recurring", icon: RefreshCw },
    ],
  },
  {
    title: "AI ASSISTANT",
    items: [
      { label: "SHYN AI", path: "/dashboard/ai", icon: Sparkles, isAi: true },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Profile", path: "/dashboard/profile", icon: User },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { setAddTransactionOpen } = useDashboard();

  return (
    <aside className="hidden md:flex flex-col w-[280px] sidebar-gradient h-screen sticky top-0 shrink-0 select-none z-40 overflow-hidden">
      
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8 shrink-0">
        <Logo 
          iconClassName="w-10 h-10" 
          showText={true} 
          textClassName="font-extrabold text-white tracking-tight text-[16px]"
          className="flex items-center gap-3"
        />
      </div>

      {/* User Profile Capsule */}
      <div className="px-5 py-4 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-bold text-xs shadow-md">
            SV
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate">Sahil Verma</p>
            <p className="text-[10px] text-white/40 truncate">Premium Plan</p>
          </div>
          <span className="w-2 h-2 bg-accent-green rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className={sIdx > 0 ? "pt-5" : ""}>
            {section.title && (
              <p className="px-3 pb-2 text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium tracking-wide transition-all group mb-0.5"
                >
                  {/* Active Pill Background */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarPill"
                        className="absolute inset-0 rounded-xl z-0 sidebar-active"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Hover BG */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.06] transition-colors z-0 pointer-events-none" />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`w-[18px] h-[18px] relative z-10 transition-colors shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-white/40 group-hover:text-white/70"
                    }`}
                  />

                  {/* Label */}
                  <span
                    className={`relative z-10 transition-colors ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-white/50 group-hover:text-white/80"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* AI sparkle indicator */}
                  {"isAi" in item && item.isAi && (
                    <span className="relative z-10 ml-auto w-1.5 h-1.5 bg-accent-orange rounded-full shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Add Transaction CTA */}
      <div className="p-4 border-t border-white/8 shrink-0 space-y-3">
        <button
          onClick={() => setAddTransactionOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 btn-primary rounded-xl text-sm active:scale-[0.97] transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>
    </aside>
  );
}
