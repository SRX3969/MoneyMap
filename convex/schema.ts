import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  transactions: defineTable({
    userId: v.string(),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    date: v.string(), // YYYY-MM-DD
    time: v.optional(v.string()), // HH:MM
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    paymentMethod: v.string(), // Cash, UPI, Credit Card, Debit Card, Bank Transfer
    receiptUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_date", ["userId", "date"])
    .index("by_userId_type", ["userId", "type"])
    .index("by_userId_category", ["userId", "category"]),

  budgets: defineTable({
    userId: v.string(),
    amount: v.number(),
    category: v.string(), // "all" or specific category
    month: v.string(), // YYYY-MM
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_month", ["userId", "month"])
    .index("by_userId_category_month", ["userId", "category", "month"]),

  goals: defineTable({
    userId: v.string(),
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    deadline: v.string(), // YYYY-MM-DD
    notes: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed")),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"]),

  goalContributions: defineTable({
    goalId: v.id("goals"),
    amount: v.number(),
    date: v.string(), // YYYY-MM-DD
    createdAt: v.number(),
  }).index("by_goalId", ["goalId"]),

  recurringTransactions: defineTable({
    userId: v.string(),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    frequency: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly"), v.literal("yearly")),
    nextDueDate: v.string(), // YYYY-MM-DD
    description: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(), // budget_warning, goal_milestone, recurring_due, report_ready
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_read", ["userId", "read"]),

  aiChats: defineTable({
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    message: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  settings: defineTable({
    userId: v.string(),
    theme: v.string(), // dark, light, system
    notificationsEnabled: v.boolean(),
    currency: v.string(), // INR
    aiPreferences: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
