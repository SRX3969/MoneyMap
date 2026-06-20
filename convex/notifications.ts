import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

// List all notifications for user
export const list = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    const notes = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Sort descending by createdAt
    return notes.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Mark single notification as read
export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

// Mark all as read
export const markAllRead = mutation({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_read", (q) => q.eq("userId", userId).eq("read", false))
      .collect();

    for (const note of unread) {
      await ctx.db.patch(note._id, { read: true });
    }
  },
});

// Delete notification
export const remove = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
