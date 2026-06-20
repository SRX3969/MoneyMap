import { mutation, query } from "./customServer";
import { v } from "convex/values";

/**
 * Register a new user in the custom users table,
 * and initialize default settings/budgets/notifications.
 */
export const signUp = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("User already exists with this email address.");
    }

    const userId = await ctx.db.insert("users", {
      tokenIdentifier: args.email,
      name: args.name,
      email: args.email,
      password: args.password,
      createdAt: Date.now(),
    });

    // Initialize default settings
    await ctx.db.insert("settings", {
      userId: userId,
      theme: "light",
      notificationsEnabled: true,
      currency: "INR",
      createdAt: Date.now(),
    });

    // Initialize default global budget limit (₹50,000) for the current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    await ctx.db.insert("budgets", {
      userId: userId,
      amount: 50000,
      category: "all",
      month: currentMonth,
      createdAt: Date.now(),
    });

    // Insert welcome notification
    await ctx.db.insert("notifications", {
      userId: userId,
      title: "Welcome to MoneyMap! 🎉",
      message: "Start logging your rupees, setting savings goals, and using SHYN AI to build wealth.",
      type: "goal_milestone",
      read: false,
      createdAt: Date.now(),
    });

    return {
      id: userId,
      name: args.name,
      email: args.email,
    };
  },
});

/**
 * Sign in a user by validating their email and password.
 */
export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    if (user.password !== args.password) {
      throw new Error("Invalid email or password.");
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  },
});
