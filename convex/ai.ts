import { action } from "./_generated/server";
import { mutation, query } from "./customServer";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { getUserId } from "./utils";

// Mutation to store chat messages
export const addChatMessage = mutation({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    await ctx.db.insert("aiChats", {
      userId,
      role: args.role,
      message: args.message,
      createdAt: Date.now(),
    });
  },
});

// Query to get chat history
export const getChatHistory = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("aiChats")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Mutation to clear chat history
export const clearChatHistory = mutation({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const chats = await ctx.db
      .query("aiChats")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const chat of chats) {
      await ctx.db.delete(chat._id);
    }
  },
});

// Convex Action to call Gemini API for general chat
export const chat = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY;

    // Get current transactions list for context
    const transactions = await ctx.runQuery(api.transactions.list, {});
    const budgetSummary = await ctx.runQuery(api.transactions.getDashboardSummary, {});

    // Save user message to database
    await ctx.runMutation(api.ai.addChatMessage, {
      role: "user",
      message: args.message,
    });

    if (!apiKey) {
      // Graceful fallback for local development if API key is not set
      console.warn("GEMINI_API_KEY environment variable is not defined. Using mock financial response.");
      let mockReply = `I received your message: "${args.message}". To enable live AI, please add **GEMINI_API_KEY** to your Convex environment variables.\n\nBased on your local data:\n- Current Balance: **₹${budgetSummary.currentBalance.toLocaleString("en-IN")}**\n- Total Expenses: **₹${budgetSummary.totalExpense.toLocaleString("en-IN")}**\nLet me know if you'd like to set a new budget!`;
      
      // Analyze user input for simple mock answers
      const lower = args.message.toLowerCase();
      if (lower.includes("food") || lower.includes("spend")) {
        const foodExp = transactions
          .filter(t => t.type === "expense" && t.category.toLowerCase() === "food")
          .reduce((sum, t) => sum + t.amount, 0);
        mockReply = `You have spent **₹${foodExp.toLocaleString("en-IN")}** on **Food**. This represents standard food tracking. Configure your Gemini API key to get deep visual category analysis and trends!`;
      }

      await ctx.runMutation(api.ai.addChatMessage, {
        role: "assistant",
        message: mockReply,
      });
      return mockReply;
    }

    // Prepare system instructions and prompt
    const systemPrompt = `You are SHYN AI, a premium, genuine financial assistant for "MoneyMap" (tagline: "Map Every Rupee").
CRITICAL DIRECTIVE: You must only provide genuine, real replies based strictly on the user's actual database records. DO NOT CREATE DATA AND SHOW. Do not fabricate, hallucinate, or generate sample/mock transactions, categories, budgets, or savings figures. If the user asks about their spending but there are no matching logs, report that no matching records were found in the database.
Refer to transactions in Indian Rupees (₹).
Below is the user's authentic financial context:
- Balance: ₹${budgetSummary.currentBalance}
- Total Income: ₹${budgetSummary.totalIncome}
- Total Expense: ₹${budgetSummary.totalExpense}
- Savings: ₹${budgetSummary.totalSavings}
- Budget utilization: ${budgetSummary.budgetUtilization.percent}% of ₹${budgetSummary.budgetUtilization.total} used

Recent transaction history:
${JSON.stringify(transactions.slice(0, 30), null, 2)}

Provide specific, concise, and highly actionable suggestions.
Format your response to be extremely user-friendly and readable:
- Use clean spacing and bullet points.
- Highlight important content (such as amounts, category names, dates, key numbers, warnings, or action steps) by wrapping them in double asterisks **like this** so they stand out clearly.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: systemPrompt }] },
              { role: "user", parts: [{ text: args.message }] }
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.2,
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to analyze that. Please try again.";

      await ctx.runMutation(api.ai.addChatMessage, {
        role: "assistant",
        message: text,
      });

      return text;
    } catch (e) {
      console.error(e);
      const errReply = "Sorry, I encountered an error communicating with the AI service. Please make sure your Gemini API key is valid.";
      await ctx.runMutation(api.ai.addChatMessage, {
        role: "assistant",
        message: errReply,
      });
      return errReply;
    }
  },
});

// Convex Action to parse transaction text using NLP
export const parseTransaction = action({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const today = new Date().toISOString().split("T")[0];

    const fallbackResult = {
      amount: 100,
      type: "expense" as const,
      category: "Miscellaneous",
      date: today,
      notes: args.text,
      success: false,
    };

    // Simple regex parsing fallback if API key is not available
    const amountMatch = args.text.match(/(?:rs\.?|₹|inr)?\s*(\d+(?:\.\d{1,2})?)/i);
    const amountVal = amountMatch ? parseFloat(amountMatch[1]) : 100;
    let categoryVal = "Miscellaneous";
    let typeVal: "expense" | "income" = "expense";

    const lowerText = args.text.toLowerCase();
    if (lowerText.includes("salary") || lowerText.includes("earned") || lowerText.includes("received")) {
      typeVal = "income";
      categoryVal = "Salary";
    } else if (lowerText.includes("chai") || lowerText.includes("tea") || lowerText.includes("lunch") || lowerText.includes("food") || lowerText.includes("dinner")) {
      categoryVal = "Food";
    } else if (lowerText.includes("cab") || lowerText.includes("uber") || lowerText.includes("auto") || lowerText.includes("petrol") || lowerText.includes("metro")) {
      categoryVal = "Petrol";
    }

    if (!apiKey) {
      return {
        ...fallbackResult,
        amount: amountVal,
        type: typeVal,
        category: categoryVal,
        notes: `Parsed locally: "${args.text}" (Gemini key not configured)`,
      };
    }

    const nlpPrompt = `You are a financial parsing assistant. The user wants to add a transaction by typing a simple text description.
Today's date is: ${today}.
Parse the text: "${args.text}" and return a JSON object with these fields:
- amount: number (e.g. 250)
- type: "income" or "expense"
- category: must be EXACTLY one of:
  For expense: Food, Groceries, Rent, Utilities, Petrol, Transport, Shopping, Entertainment, Medical, Education, EMI, Insurance, Investments, Miscellaneous
  For income: Salary, Freelance, Business, Interest, Refund, Gift, Other
- date: YYYY-MM-DD
- notes: string (summarize what the transaction was, e.g., "Lunch with colleagues")

Return ONLY the JSON string. Do not wrap it in markdown code blocks or triple backticks.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: nlpPrompt }] }],
            generationConfig: {
              maxOutputTokens: 200,
              temperature: 0.1,
              responseMimeType: "application/json",
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      const parsed = JSON.parse(rawText.trim());
      return {
        amount: Number(parsed.amount) || amountVal,
        type: parsed.type === "income" ? "income" : "expense",
        category: parsed.category || categoryVal,
        date: parsed.date || today,
        notes: parsed.notes || args.text,
        success: true,
      };
    } catch (e) {
      console.error("Gemini parse failed: ", e);
      return {
        amount: amountVal,
        type: typeVal,
        category: categoryVal,
        date: today,
        notes: args.text,
        success: false,
      };
    }
  },
});
