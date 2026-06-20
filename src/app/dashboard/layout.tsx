"use client";

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
