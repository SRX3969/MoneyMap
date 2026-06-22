"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

export default function TopHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("moneymap_user");
      return saved ? JSON.parse(saved) : { name: "Sahil Verma" };
    }
    return { name: "Sahil Verma" };
  });

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    const handleAuthChange = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("moneymap_user");
        if (saved) setCurrentUser(JSON.parse(saved));
      }
    };
    window.addEventListener("moneymap_auth_change", handleAuthChange);
    return () => window.removeEventListener("moneymap_auth_change", handleAuthChange);
  }, []);

  const currentMonth = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-border shrink-0 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search anything..."
          className="w-full pl-11 pr-4 py-2.5 bg-page-bg border border-border rounded-2xl text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all"
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 ml-6">
        {/* Date Filter */}
        <button className="flex items-center gap-1.5 px-4 py-2 bg-page-bg border border-border rounded-xl text-xs font-medium text-text-secondary hover:bg-hover transition-colors">
          <span>{currentMonth}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 bg-page-bg border border-border rounded-xl text-text-secondary hover:bg-hover transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full border-2 border-white" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {getInitials(currentUser.name)}
          </div>
          <span className="text-xs font-semibold text-text-secondary hidden sm:inline-block">
            {currentUser.name}
          </span>
        </div>
      </div>
    </header>
  );
}
