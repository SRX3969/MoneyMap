import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

// Create or update category budget
export const upsert = mutation({
  args: {
    amount: v.number(),
    category: v.string(), // "all" or specific category
    month: v.string(), // YYYY-MM
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const existing = await ctx.db
      .query("budgets")
      .withIndex("by_userId_category_month", (q) =>
        q.eq("userId", userId).eq("category", args.category).eq("month", args.month)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { amount: args.amount });
      return existing._id;
    } else {
      return await ctx.db.insert("budgets", {
        userId,
        amount: args.amount,
        category: args.category,
        month: args.month,
        createdAt: Date.now(),
      });
    }
  },
});

// Remove budget
export const remove = mutation({
  args: { id: v.id("budgets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// List budgets for a specific month
export const list = query({
  args: { month: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    const now = new Date();
    const targetMonth = args.month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_userId_month", (q) => q.eq("userId", userId).eq("month", targetMonth))
      .collect();

    // Enrich with actual spending
    const startOfMonth = `${targetMonth}-01`;
    const endOfMonth = `${targetMonth}-31`;
    const txs = await ctx.db
      .query("transactions")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", userId).gte("date", startOfMonth).lte("date", endOfMonth)
      )
      .collect();

    const expenses = txs.filter((t) => t.type === "expense");

    return budgets.map((b) => {
      const spent = expenses
        .filter((t) => b.category === "all" || t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...b,
        spent,
        remaining: Math.max(0, b.amount - spent),
        percent: b.amount > 0 ? Math.min(100, (spent / b.amount) * 100) : 0,
      };
    });
  },
});

// Spend forecasting query
export const getForecast = query({
  args: { month: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    const now = new Date();
    const targetMonth = args.month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const startOfMonth = `${targetMonth}-01`;
    const endOfMonth = `${targetMonth}-31`;

    const txs = await ctx.db
      .query("transactions")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", userId).gte("date", startOfMonth).lte("date", endOfMonth)
      )
      .collect();

    const expenses = txs.filter((t) => t.type === "expense");
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_userId_month", (q) => q.eq("userId", userId).eq("month", targetMonth))
      .collect();

    const globalBudget = budgets.find((b) => b.category === "all")?.amount || 0;

    // Calculate year and month number of the target month
    const [yearStr, monthStr] = targetMonth.split("-");
    const targetYear = parseInt(yearStr, 10);
    const targetMonthNum = parseInt(monthStr, 10); // 1-indexed

    // Calculate total days in the target month
    const daysInTargetMonth = new Date(targetYear, targetMonthNum, 0).getDate();

    // Determine how many days have elapsed in the target month
    const currentYear = now.getFullYear();
    const currentMonthNum = now.getMonth() + 1;

    let elapsedDays = 0;
    if (targetYear < currentYear || (targetYear === currentYear && targetMonthNum < currentMonthNum)) {
      // Past month: all days have elapsed
      elapsedDays = daysInTargetMonth;
    } else if (targetYear === currentYear && targetMonthNum === currentMonthNum) {
      // Current month: elapsed days is current date
      elapsedDays = now.getDate();
    } else {
      // Future month: 0 days elapsed
      elapsedDays = 0;
    }

    // Forecast: linear projection
    const dailyAvg = elapsedDays > 0 ? totalSpent / elapsedDays : 0;
    const projectedSpend = elapsedDays > 0 ? dailyAvg * daysInTargetMonth : 0;

    return {
      currentDay: elapsedDays,
      daysInMonth: daysInTargetMonth,
      totalSpent,
      projectedSpend,
      globalBudget,
      isOverBudget: globalBudget > 0 && projectedSpend > globalBudget,
      varianceAmount: globalBudget > 0 ? Math.abs(projectedSpend - globalBudget) : 0,
    };
  },
});
