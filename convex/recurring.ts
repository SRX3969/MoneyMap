import { mutation, query } from "./customServer";
import { v } from "convex/values";
import { getUserId } from "./utils";

/**
 * List all recurring transactions for the current user,
 * sorted by nextDueDate ascending (soonest first).
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const items = await ctx.db
      .query("recurringTransactions")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .collect();

    // Sort by nextDueDate ascending
    return items.sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate));
  },
});

/**
 * Create a new recurring transaction entry.
 */
export const create = mutation({
  args: {
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    frequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    ),
    nextDueDate: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    await ctx.db.insert("recurringTransactions", {
      userId,
      amount: args.amount,
      type: args.type,
      category: args.category,
      frequency: args.frequency,
      nextDueDate: args.nextDueDate,
      description: args.description,
      createdAt: Date.now(),
    });
  },
});

/**
 * Update an existing recurring transaction.
 */
export const update = mutation({
  args: {
    id: v.id("recurringTransactions"),
    amount: v.optional(v.number()),
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
    category: v.optional(v.string()),
    frequency: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
        v.literal("yearly")
      )
    ),
    nextDueDate: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }
    await ctx.db.patch(id, cleanUpdates);
  },
});

/**
 * Delete a recurring transaction.
 */
export const remove = mutation({
  args: { id: v.id("recurringTransactions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Helper: advance a date string by the given frequency.
 */
function advanceDate(
  dateStr: string,
  frequency: "daily" | "weekly" | "monthly" | "yearly"
): string {
  const d = new Date(dateStr + "T00:00:00");
  switch (frequency) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d.toISOString().split("T")[0];
}

/**
 * Mark a recurring transaction as paid:
 * 1. Create a real transaction in the transactions table.
 * 2. Advance the nextDueDate by the frequency interval.
 * 3. Optionally generate a notification.
 */
export const markAsPaid = mutation({
  args: {
    id: v.id("recurringTransactions"),
  },
  handler: async (ctx, args) => {
    const recurring = await ctx.db.get(args.id);
    if (!recurring) throw new Error("Recurring transaction not found");

    const userId = recurring.userId;
    const today = new Date().toISOString().split("T")[0];

    // 1. Insert a real transaction
    await ctx.db.insert("transactions", {
      userId,
      amount: recurring.amount,
      type: recurring.type,
      category: recurring.category,
      date: today,
      notes: `Recurring: ${recurring.description}`,
      paymentMethod: "UPI",
      createdAt: Date.now(),
    });

    // 2. Advance the due date
    const newDueDate = advanceDate(recurring.nextDueDate, recurring.frequency);
    await ctx.db.patch(args.id, { nextDueDate: newDueDate });

    // 3. Create a notification
    await ctx.db.insert("notifications", {
      userId,
      title: `Recurring ${recurring.type === "income" ? "Income" : "Bill"} Logged`,
      message: `${recurring.description} — ₹${recurring.amount.toLocaleString("en-IN")} recorded. Next due: ${newDueDate}.`,
      type: "recurring_due",
      read: false,
      createdAt: Date.now(),
    });

    return { newDueDate };
  },
});
