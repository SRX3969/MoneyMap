import { MutationCtx } from "./_generated/server";
import { mutation, query } from "./customServer";
import { v } from "convex/values";
import { getUserId } from "./utils";

// Helper to check budget and generate notification
async function checkBudget(ctx: MutationCtx, userId: string, category: string, date: string) {
  const month = date.substring(0, 7); // YYYY-MM

  // Find budget for specific category, or fallback to 'all' global budget
  const categoryBudget = await ctx.db
    .query("budgets")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .withIndex("by_userId_category_month", (q: any) =>
      q.eq("userId", userId).eq("category", category).eq("month", month)
    )
    .first();

  const globalBudget = await ctx.db
    .query("budgets")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .withIndex("by_userId_category_month", (q: any) =>
      q.eq("userId", userId).eq("category", "all").eq("month", month)
    )
    .first();

  const budgetsToCheck: any[] = [];
  if (categoryBudget) budgetsToCheck.push(categoryBudget);
  if (globalBudget) budgetsToCheck.push(globalBudget);

  for (const budget of budgetsToCheck) {
    // Sum transactions for this budget scope in this month
    const startOfMonth = `${month}-01`;
    const endOfMonth = `${month}-31`; // Simple bounding date search
    const txs = await ctx.db
      .query("transactions")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .withIndex("by_userId_date", (q: any) =>
        q.eq("userId", userId).gte("date", startOfMonth).lte("date", endOfMonth)
      )
      .collect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = txs.filter((t: any) => 
      t.type === "expense" && (budget.category === "all" || t.category === budget.category)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalExpense = filtered.reduce((sum: number, t: any) => sum + t.amount, 0);
    const limit = budget.amount;
    const ratio = totalExpense / limit;

    if (ratio >= 1.0) {
      // Exceeded
      await ctx.db.insert("notifications", {
        userId,
        title: `Budget Exceeded - ${budget.category === "all" ? "Global" : budget.category}`,
        message: `You spent ₹${totalExpense.toLocaleString("en-IN")} out of your ₹${limit.toLocaleString("en-IN")} budget.`,
        type: "budget_warning",
        read: false,
        createdAt: Date.now(),
      });
    } else if (ratio >= 0.8) {
      // Warning
      await ctx.db.insert("notifications", {
        userId,
        title: `Budget Warning - ${budget.category === "all" ? "Global" : budget.category}`,
        message: `You spent ₹${totalExpense.toLocaleString("en-IN")} which is ${Math.round(ratio * 100)}% of your ₹${limit.toLocaleString("en-IN")} budget.`,
        type: "budget_warning",
        read: false,
        createdAt: Date.now(),
      });
    }
  }
}

// Create transaction
export const create = mutation({
  args: {
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    paymentMethod: v.string(),
    receiptUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const id = await ctx.db.insert("transactions", {
      userId,
      ...args,
      createdAt: Date.now(),
    });

    if (args.type === "expense") {
      await checkBudget(ctx, userId, args.category, args.date);
    }

    return id;
  },
});

// Update transaction
export const update = mutation({
  args: {
    id: v.id("transactions"),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    paymentMethod: v.string(),
    receiptUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    
    if (data.type === "expense") {
      const userId = await getUserId(ctx);
      await checkBudget(ctx, userId, data.category, data.date);
    }
  },
});

// Delete single transaction
export const remove = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Delete multiple transactions
export const removeMany = mutation({
  args: { ids: v.array(v.id("transactions")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.delete(id);
    }
  },
});

// List transactions with search & filter
export const list = query({
  args: {
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    search: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const txsQuery = ctx.db.query("transactions").withIndex("by_userId", (q) => q.eq("userId", userId));

    let txs = await txsQuery.collect();

    // Sort descending by date, then time or createdAt
    txs.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      return timeB.localeCompare(timeA);
    });

    // In-memory filters (since Convex query limits simple multi-field indexing)
    if (args.type) {
      txs = txs.filter((t) => t.type === args.type);
    }
    if (args.category) {
      txs = txs.filter((t) => t.category === args.category);
    }
    if (args.startDate) {
      txs = txs.filter((t) => t.date >= args.startDate!);
    }
    if (args.endDate) {
      txs = txs.filter((t) => t.date <= args.endDate!);
    }
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      txs = txs.filter(
        (t) =>
          (t.notes && t.notes.toLowerCase().includes(searchLower)) ||
          t.category.toLowerCase().includes(searchLower) ||
          t.paymentMethod.toLowerCase().includes(searchLower) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
      );
    }

    return txs;
  },
});

// Calendar Indicators mapping
export const getCalendarData = query({
  args: {
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(),   // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const txs = await ctx.db
      .query("transactions")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", userId).gte("date", args.startDate).lte("date", args.endDate)
      )
      .collect();

    // Group transactions by date
    const summary: Record<string, { expense: number; income: number; count: number }> = {};

    for (const t of txs) {
      if (!summary[t.date]) {
        summary[t.date] = { expense: 0, income: 0, count: 0 };
      }
      summary[t.date].count += 1;
      if (t.type === "expense") {
        summary[t.date].expense += t.amount;
      } else {
        summary[t.date].income += t.amount;
      }
    }

    return summary;
  },
});

// Daily analytics and detail drawer content
export const getDailyAnalytics = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const txs = await ctx.db
      .query("transactions")
      .withIndex("by_userId_date", (q) => q.eq("userId", userId).eq("date", args.date))
      .collect();

    let totalExpense = 0;
    let totalIncome = 0;
    const categoryBreakdown: Record<string, number> = {};

    for (const t of txs) {
      if (t.type === "expense") {
        totalExpense += t.amount;
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      } else {
        totalIncome += t.amount;
      }
    }

    return {
      date: args.date,
      totalExpense,
      totalIncome,
      netBalance: totalIncome - totalExpense,
      transactions: txs,
      categoryBreakdown,
    };
  },
});

// Dashboard details summary
export const getDashboardSummary = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    const txs = await ctx.db
      .query("transactions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Sort transactions by date descending
    txs.sort((a, b) => b.date.localeCompare(a.date));

    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of txs) {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    }

    const currentBalance = totalIncome - totalExpense;

    // Get current month budgets
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_userId_month", (q) => q.eq("userId", userId).eq("month", currentMonth))
      .collect();

    // Calculate total budget and current utilization
    let totalBudgetAmount = 0;
    let budgetSpent = 0;

    const globalBudget = budgets.find((b) => b.category === "all");

    // Define current month boundaries for transactions
    const currentMonthStart = `${currentMonth}-01`;
    const currentMonthEnd = `${currentMonth}-31`;
    const monthlyTxs = txs.filter(
      (t) => t.date >= currentMonthStart && t.date <= currentMonthEnd && t.type === "expense"
    );

    if (globalBudget) {
      totalBudgetAmount = globalBudget.amount;
      budgetSpent = monthlyTxs.reduce((sum, t) => sum + t.amount, 0); // Corrected to current month expenses
    } else {
      totalBudgetAmount = budgets.reduce((sum, b) => sum + b.amount, 0);
      // For each budgeted category, sum expenses in current month
      for (const b of budgets) {
        const catSpent = monthlyTxs.filter((t) => t.category === b.category).reduce((sum, t) => sum + t.amount, 0);
        budgetSpent += catSpent;
      }
    }

    // Get active goals summary
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_userId_status", (q) => q.eq("userId", userId).eq("status", "active"))
      .collect();

    const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0);

    return {
      currentBalance,
      totalIncome,
      totalExpense,
      totalSavings,
      budgetUtilization: {
        total: totalBudgetAmount,
        spent: budgetSpent,
        remaining: Math.max(0, totalBudgetAmount - budgetSpent),
        percent: totalBudgetAmount > 0 ? Math.min(100, (budgetSpent / totalBudgetAmount) * 100) : 0,
      },
      recentTransactions: txs.slice(0, 5),
    };
  },
});
