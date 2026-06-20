import { mutation } from "./_generated/server";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = "guest_user";

    // 1. Clear existing seed-like data to avoid duplicate seeding runs
    const existingTx = await ctx.db.query("transactions").collect();
    for (const tx of existingTx) {
      if (tx.userId === userId) {
        await ctx.db.delete(tx._id);
      }
    }

    const existingBudgets = await ctx.db.query("budgets").collect();
    for (const b of existingBudgets) {
      if (b.userId === userId) {
        await ctx.db.delete(b._id);
      }
    }

    const existingGoals = await ctx.db.query("goals").collect();
    for (const g of existingGoals) {
      if (g.userId === userId) {
        await ctx.db.delete(g._id);
      }
    }

    const existingRecurring = await ctx.db.query("recurringTransactions").collect();
    for (const rc of existingRecurring) {
      if (rc.userId === userId) {
        await ctx.db.delete(rc._id);
      }
    }

    const existingNotif = await ctx.db.query("notifications").collect();
    for (const n of existingNotif) {
      if (n.userId === userId) {
        await ctx.db.delete(n._id);
      }
    }

    const existingSettings = await ctx.db.query("settings").collect();
    for (const s of existingSettings) {
      if (s.userId === userId) {
        await ctx.db.delete(s._id);
      }
    }

    // 2. Generate dynamic current month and year values
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthNum = now.getMonth() + 1;
    const currentMonthStr = String(currentMonthNum).padStart(2, "0");
    const currentMonth = `${currentYear}-${currentMonthStr}`; // YYYY-MM

    // Pad days helper
    const padDay = (day: number) => String(day).padStart(2, "0");

    // 3. Seed User Profile
    const existingUsers = await ctx.db.query("users").collect();
    const guestUserRecord = existingUsers.find(u => u.tokenIdentifier === userId);
    if (!guestUserRecord) {
      await ctx.db.insert("users", {
        tokenIdentifier: userId,
        name: "Guest User",
        email: "guest@moneymap.in",
        avatarUrl: undefined,
        createdAt: Date.now(),
      });
    }

    // 4. Seed Budgets
    await ctx.db.insert("budgets", {
      userId,
      amount: 15000,
      category: "Food",
      month: currentMonth,
      createdAt: Date.now(),
    });

    await ctx.db.insert("budgets", {
      userId,
      amount: 30000,
      category: "Rent",
      month: currentMonth,
      createdAt: Date.now(),
    });

    await ctx.db.insert("budgets", {
      userId,
      amount: 10000,
      category: "Shopping",
      month: currentMonth,
      createdAt: Date.now(),
    });

    await ctx.db.insert("budgets", {
      userId,
      amount: 5000,
      category: "Transport",
      month: currentMonth,
      createdAt: Date.now(),
    });

    // 5. Seed Transactions (spread across the current month)
    // Monthly Salary
    await ctx.db.insert("transactions", {
      userId,
      amount: 85000,
      type: "income",
      category: "Salary",
      date: `${currentMonth}-${padDay(1)}`,
      time: "09:30",
      notes: "HDFC Monthly Salary Credit",
      paymentMethod: "Bank Transfer",
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    });

    // Freelance Payment
    await ctx.db.insert("transactions", {
      userId,
      amount: 12500,
      type: "income",
      category: "Freelance",
      date: `${currentMonth}-${padDay(10)}`,
      time: "15:45",
      notes: "Landing page UI design contract",
      paymentMethod: "UPI",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    });

    // Rent expense
    await ctx.db.insert("transactions", {
      userId,
      amount: 25000,
      type: "expense",
      category: "Rent",
      date: `${currentMonth}-${padDay(2)}`,
      time: "10:00",
      notes: "Flat 402 Apartment Rent",
      paymentMethod: "Bank Transfer",
      createdAt: Date.now() - 13 * 24 * 60 * 60 * 1000,
    });

    // Food expense 1
    await ctx.db.insert("transactions", {
      userId,
      amount: 450,
      type: "expense",
      category: "Food",
      date: `${currentMonth}-${padDay(5)}`,
      time: "13:20",
      notes: "Swiggy lunch order",
      paymentMethod: "UPI",
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    });

    // Food expense 2
    await ctx.db.insert("transactions", {
      userId,
      amount: 1250,
      type: "expense",
      category: "Food",
      date: `${currentMonth}-${padDay(12)}`,
      time: "20:30",
      notes: "Dinner with friends at Social",
      paymentMethod: "UPI",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    });

    // Transport expense 1
    await ctx.db.insert("transactions", {
      userId,
      amount: 180,
      type: "expense",
      category: "Transport",
      date: `${currentMonth}-${padDay(4)}`,
      time: "09:00",
      notes: "Uber Auto commute",
      paymentMethod: "UPI",
      createdAt: Date.now() - 11 * 24 * 60 * 60 * 1000,
    });

    // Transport expense 2
    await ctx.db.insert("transactions", {
      userId,
      amount: 1200,
      type: "expense",
      category: "Transport",
      date: `${currentMonth}-${padDay(8)}`,
      time: "18:00",
      notes: "Petrol refuel shell station",
      paymentMethod: "Credit Card",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    });

    // Shopping expense 1
    await ctx.db.insert("transactions", {
      userId,
      amount: 3200,
      type: "expense",
      category: "Shopping",
      date: `${currentMonth}-${padDay(7)}`,
      time: "16:40",
      notes: "Mechanical keyboard from Amazon",
      paymentMethod: "Credit Card",
      createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    });

    // Shopping expense 2
    await ctx.db.insert("transactions", {
      userId,
      amount: 1800,
      type: "expense",
      category: "Shopping",
      date: `${currentMonth}-${padDay(14)}`,
      time: "11:15",
      notes: "Zara T-Shirts",
      paymentMethod: "Debit Card",
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    });

    // 6. Seed Goals & Goal Contributions
    const goalId1 = await ctx.db.insert("goals", {
      userId,
      name: "Emergency Fund",
      targetAmount: 100000,
      currentAmount: 45000,
      deadline: `${currentYear}-12-31`,
      notes: "Targeting 4 months of monthly expenses",
      status: "active",
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("goalContributions", {
      goalId: goalId1,
      amount: 10000,
      date: `${currentMonth}-${padDay(5)}`,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("goalContributions", {
      goalId: goalId1,
      amount: 15000,
      date: `${currentMonth}-${padDay(10)}`,
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    });

    const goalId2 = await ctx.db.insert("goals", {
      userId,
      name: "Buy iPhone 17 Pro",
      targetAmount: 130000,
      currentAmount: 20000,
      deadline: `${currentYear + 1}-02-28`,
      notes: "Upgrade from current iPhone 13",
      status: "active",
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("goalContributions", {
      goalId: goalId2,
      amount: 20000,
      date: `${currentMonth}-${padDay(8)}`,
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Seed Recurring Transactions
    await ctx.db.insert("recurringTransactions", {
      userId,
      amount: 199,
      type: "expense",
      category: "Entertainment",
      frequency: "monthly",
      nextDueDate: `${currentMonth}-${padDay(28)}`,
      description: "Netflix Mobile Plan",
      createdAt: Date.now(),
    });

    await ctx.db.insert("recurringTransactions", {
      userId,
      amount: 699,
      type: "expense",
      category: "Bills",
      frequency: "monthly",
      nextDueDate: `${currentMonth}-${padDay(25)}`,
      description: "Jio Fiber Broadband",
      createdAt: Date.now(),
    });

    // 8. Seed Notifications
    await ctx.db.insert("notifications", {
      userId,
      title: "Welcome to MoneyMap!",
      message: "Your live database and realtime budget engines are ready.",
      type: "report_ready",
      read: false,
      createdAt: Date.now(),
    });

    // 9. Seed Settings
    await ctx.db.insert("settings", {
      userId,
      theme: "light",
      notificationsEnabled: true,
      currency: "INR",
      aiPreferences: "Tailor suggestions around savings rates and food delivery optimization.",
      createdAt: Date.now(),
    });

    return { success: true, seededMonth: currentMonth };
  },
});
