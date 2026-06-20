import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { DashboardProvider } from "@/context/dashboard-context";

export const metadata: Metadata = {
  title: "MoneyMap — Map Every Rupee. Build Wealth. Live Better.",
  description: "The all-in-one AI-powered personal finance tracker designed for India. Track income, expenses, budgets, savings goals, and get real-time financial advice.",
  keywords: ["personal finance", "expense tracker", "budget planner", "money manager", "India finance", "UPI tracker", "AI finance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F6F8FC] text-[#0F172A] selection:bg-brand selection:text-white">
        <ConvexClientProvider>
          <DashboardProvider>
            {children}
          </DashboardProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
