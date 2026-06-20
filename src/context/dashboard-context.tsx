"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DashboardContextType {
  isAddTransactionOpen: boolean;
  setAddTransactionOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  isDateDetailOpen: boolean;
  setDateDetailOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDateDetailOpen, setDateDetailOpen] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        isAddTransactionOpen,
        setAddTransactionOpen,
        isAiAssistantOpen,
        setAiAssistantOpen,
        selectedDate,
        setSelectedDate,
        isDateDetailOpen,
        setDateDetailOpen,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
