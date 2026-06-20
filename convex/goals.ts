import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

// Create savings goal
export const create = mutation({
  args: {
    name: v.string(),
    targetAmount: v.number(),
    deadline: v.string(), // YYYY-MM-DD
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    return await ctx.db.insert("goals", {
      userId,
      name: args.name,
      targetAmount: args.targetAmount,
      currentAmount: 0,
      deadline: args.deadline,
      notes: args.notes,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

// Update savings goal
export const update = mutation({
  args: {
    id: v.id("goals"),
    name: v.string(),
    targetAmount: v.number(),
    deadline: v.string(),
    notes: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Delete goal
export const remove = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    // Delete all contributions first
    const contributions = await ctx.db
      .query("goalContributions")
      .withIndex("by_goalId", (q) => q.eq("goalId", args.id))
      .collect();
    for (const c of contributions) {
      await ctx.db.delete(c._id);
    }
    await ctx.db.delete(args.id);
  },
});

// Add contribution to a savings goal
export const addContribution = mutation({
  args: {
    goalId: v.id("goals"),
    amount: v.number(),
    date: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.goalId);
    if (!goal) throw new Error("Goal not found");

    const newAmount = goal.currentAmount + args.amount;
    const isCompleted = newAmount >= goal.targetAmount;

    await ctx.db.patch(args.goalId, {
      currentAmount: newAmount,
      status: isCompleted ? "completed" : goal.status,
    });

    await ctx.db.insert("goalContributions", {
      goalId: args.goalId,
      amount: args.amount,
      date: args.date,
      createdAt: Date.now(),
    });

    const userId = await getUserId(ctx);

    if (isCompleted && goal.status !== "completed") {
      // Trigger milestone notification!
      await ctx.db.insert("notifications", {
        userId,
        title: `Goal Achieved! 🎉`,
        message: `Congratulations! You have reached your savings target of ₹${goal.targetAmount.toLocaleString("en-IN")} for "${goal.name}".`,
        type: "goal_milestone",
        read: false,
        createdAt: Date.now(),
      });
    }

    return { success: true, isCompleted };
  },
});

// List all goals with contributions
export const list = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    const goals = await ctx.db
      .query("goals")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const enrichedGoals = [];

    for (const g of goals) {
      const contributions = await ctx.db
        .query("goalContributions")
        .withIndex("by_goalId", (q) => q.eq("goalId", g._id))
        .collect();

      // Sort contributions by date descending
      contributions.sort((a, b) => b.date.localeCompare(a.date));

      enrichedGoals.push({
        ...g,
        contributions,
        percent: g.targetAmount > 0 ? Math.min(100, (g.currentAmount / g.targetAmount) * 100) : 0,
        remaining: Math.max(0, g.targetAmount - g.currentAmount),
      });
    }

    // Sort active first, then by deadline
    return enrichedGoals.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "active" ? -1 : 1;
      }
      return a.deadline.localeCompare(b.deadline);
    });
  },
});
