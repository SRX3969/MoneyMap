"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/navigation/sidebar";
import BottomNav from "@/components/navigation/bottom-nav";
import TopHeader from "@/components/navigation/top-header";
import FloatingAiWidget from "@/components/ai/floating-widget";
import AddTransactionDrawer from "@/components/transactions/add-transaction-drawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("moneymap_user");
        if (!saved) {
          router.push("/login");
        } else {
          setIsAuthenticated(true);
        }
      }
    };
    
    checkAuth();
    window.addEventListener("moneymap_auth_change", checkAuth);
    
    return () => {
      window.removeEventListener("moneymap_auth_change", checkAuth);
    };
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-page-bg text-text-primary select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-[3px] border-brand/20 border-t-brand animate-spin" />
          <p className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-page-bg overflow-hidden text-text-primary select-none">
      
      {/* Dark Navy Sidebar — Desktop Only */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Sticky Top Header — Desktop Only */}
        <TopHeader />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto pb-28 md:pb-6">
          {children}
        </main>

        {/* Floating Bottom Nav — Mobile Only */}
        <BottomNav />

        {/* Global AI Chat Widget */}
        <FloatingAiWidget />

        {/* Global Transaction Drawer */}
        <AddTransactionDrawer />
      </div>
    </div>
  );
}
