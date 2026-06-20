import { useQuery as rawUseQuery, useMutation as rawUseMutation, useAction as rawUseAction } from "convex/react";
import { useState, useEffect } from "react";

// Helper to get local userId synchronously
function getLocalUserId(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("moneymap_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.id) return u.id;
      } catch (e) {}
    }
  }
  return "guest_user";
}

export function useQuery(query: any, args: any = {}) {
  const [userId, setUserId] = useState<string>(() => getLocalUserId());

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(getLocalUserId());
    };

    // Listen for custom sign-in storage events to update query user state instantly
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("moneymap_auth_change", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("moneymap_auth_change", handleStorageChange);
    };
  }, []);

  if (args === "skip") {
    return rawUseQuery(query, "skip");
  }

  // Inject userId automatically
  return rawUseQuery(query, { ...args, userId });
}

export function useMutation(mutation: any) {
  const rawMutate = rawUseMutation(mutation);

  return async (args: any = {}) => {
    const userId = getLocalUserId();
    return rawMutate({ ...args, userId });
  };
}

export function useAction(action: any) {
  const rawAct = rawUseAction(action);

  return async (args: any = {}) => {
    // Actions are usually not wrapped directly but we can inject userId if needed
    const userId = getLocalUserId();
    return rawAct({ ...args, userId });
  };
}
