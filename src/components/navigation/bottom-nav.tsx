"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/context/dashboard-context";
import { Home, FileText, Plus, PieChart, Target } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { setAddTransactionOpen } = useDashboard();

  const navItems = [
    { label: "Home", path: "/dashboard", icon: Home },
    { label: "Transactions", path: "/dashboard/transactions", icon: FileText },
    { label: "add", path: "#", icon: Plus, isAdd: true },
    { label: "Budgets", path: "/dashboard/budgets", icon: PieChart },
    { label: "Goals", path: "/dashboard/goals", icon: Target },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
      <nav className="mx-4 mb-4 py-2 px-2 flex items-center justify-around bg-white/90 backdrop-blur-xl rounded-[22px] shadow-[0_8px_40px_rgba(15,23,42,0.12)] border border-border/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          if (item.isAdd) {
            return (
              <button
                key="add-btn"
                onClick={() => setAddTransactionOpen(true)}
                className="w-12 h-12 -mt-5 btn-primary rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(124,58,237,0.35)] active:scale-90 transition-transform"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all group"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon
                  className={`w-[22px] h-[22px] transition-all duration-300 ${
                    isActive
                      ? "text-brand"
                      : "text-text-muted group-hover:text-text-secondary"
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    isActive ? "text-brand" : "text-text-muted"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="mobileActiveDot"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-1 h-1 bg-brand rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
