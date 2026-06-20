# 📍 MoneyMap

MoneyMap is a premium, state-of-the-art Light-Themed Fintech SaaS platform designed to help users track, manage, and optimize their personal finances. With modern typography, curated color palettes, elegant glassmorphism, micro-animations, and AI-powered financial coaching, MoneyMap turns personal finance into a beautiful and interactive experience.

![Dashboard Mockup](/public/dashboard_mockup.png)

---

## 🚀 Key Features

*   **📊 Dynamic Financial Dashboard**
    *   Real-time overview of current net worth, monthly income, expenses, and savings.
    *   Interactive transaction drawers and instant summaries.
*   **💸 Budget Tracking & Forecasting**
    *   Set monthly budget limits for custom categories.
    *   Smart forecasting panel showing estimated spending trajectories based on historical patterns.
*   **🎯 Goal Planning & Celebrations**
    *   Create and track savings goals with animated progress bars.
    *   Dynamic confetti celebrations upon goal completion to drive positive financial behavior.
*   **📈 Rich Analytics & Reports**
    *   Beautiful interactive Area and Pie charts to visualize cash flow over custom time ranges.
    *   AI-generated summaries detailing key financial insights, warnings, and spending trends.
*   **🗓️ Recurring Payments Calendar**
    *   Stay on top of bills and subscriptions with automated recurring tracking.
    *   Due-date badges and commitment summaries to prevent late fees.
*   **🤖 AI Personal Finance Coach**
    *   An interactive chat interface with pre-suggested quick-prompts.
    *   Generative, context-aware suggestions for budgeting and saving optimization.
*   **🔔 Intelligent Notification Center**
    *   Dynamic dropdown alerts warning of budget overruns, upcoming bills, and achievement milestones.

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for robust static typing
*   **Styling**: Pure CSS combined with TailwindCSS tokens for a premium light-themed design system
*   **Database & Backend**: [Convex](https://www.convex.dev/) for real-time reactivity and live syncing
*   **Icons**: [Lucide React](https://lucide.dev/) for sleek, modern iconography
*   **Animations**: Micro-interactions, custom hover glows, and confetti components for enhanced engagement

---

## 🎨 Design System

MoneyMap is built on a highly polished light-theme design system:
*   **Harmony Palette**: Curated slate and indigo brand-bg accents, slate-900 for high-contrast primary text, and slate-500/600 for soft secondary context.
*   **Elevations**: Dynamic glassmorphism layers, soft borders, and floating shadows (`shadow-float`) that respond to user hover actions.
*   **Micro-interactions**: Smooth transitions on inputs, sidebars, and buttons, giving the interface a premium, responsive feel.

---

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/SRX3969/MoneyMap.git
cd MoneyMap
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add your Convex deployment details:
```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 4. Run the Development Server
Run Convex in development mode:
```bash
npx convex dev
```
In another terminal, start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
