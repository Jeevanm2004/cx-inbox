# Yellow.ai | CX Conversation Triage Inbox

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://cx-inbox.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Jeevanm2004%2Fcx--inbox-181717?style=for-the-badge&logo=github)](https://github.com/Jeevanm2004/cx-inbox)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A purpose-built triage workspace designed for human Customer Experience (CX) agents to instantly prioritize, manage, and resolve escalated conversations. Built with React 19, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## 🔗 Live Demo

👉 **[https://cx-inbox.vercel.app](https://cx-inbox.vercel.app)**

> Fully functional with mock data via MSW (Mock Service Worker) — no backend required.

---

## Setup & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run the local development server**:
   ```bash
   npm run dev
   ```
3. **Open the browser**:
   Navigate to [http://localhost:5173/](http://localhost:5173/)

4. **Production build verification**:
   ```bash
   npm run build
   ```

---

## Product Decisions & UX Craft

The assignment brief asks how to turn an ambiguous problem (a noisy, generic queue causing agents to miss critical updates) into a sharp, shippable product. Here are the core user-centric features implemented to achieve this:

### 1. Triage Insights Dashboard ("Manager Asking for Numbers")
Agents often start their shift under pressure, with managers demanding statistics. We built a collapsible high-fidelity metrics dashboard inside the sidebar (closed by default to reduce clutter) and a larger, operations-center dashboard rendered directly on the Welcome Screen when no conversation is active. It displays live calculations of:
*   Unassigned Tickets: Immediate visibility of unallocated work.
*   SLA Breaches: Open conversations waiting for more than 30 minutes.
*   Avg Wait Time: Helps track queue health.
*   Avg CSAT: Gives immediate feedback on team performance.

### 2. Pulsing SLA Warning Highlights
To help agents "know what to do first within seconds," urgent conversations waiting >30 minutes get marked with a pulsing SLA Breach badge. Additionally, cards for breaching tickets are styled with a subtle red border and pink backdrop when not selected, creating an immediate visual hierarchy.

### 3. Keyboard-First HUD & Cheat Sheet
To ensure agents can work without their hands leaving the keyboard, we integrated:
*   Inline Kbd Badges: Next to actionable buttons, we display display small keyboard key indicators (e.g., `[A]` for Assign to me, `[R]` for Resolve).
*   Command-Style Search (`/`): Pressing `/` instantly focuses a command-style search input to filter the inbox list.
*   Welcome Screen Reference: The main welcome workspace features a beautiful 2-column grid reference displaying all shortcuts, with the navigation shortcuts taking full width of the table.
*   Interactive Guide Modal (`?`): Pressing `?` opens a premium spring-animated keyboard shortcuts overlay modal.

#### Keyboard Shortcuts Cheat Sheet:
*   `j` / `ArrowDown` — Navigate to the next conversation card (takes full width)
*   `k` / `ArrowUp` — Navigate to the previous conversation card (takes full width)
*   `i` — Focus the reply input field
*   `Esc` — Unfocus/Blur the current input field
*   `a` — Assign the active conversation to yourself
*   `r` — Resolve the active conversation
*   `/` — Focus the inbox search input
*   `?` — Open/close the keyboard shortcuts help dialog

### 4. OLED Black Dark Mode Theme
The application features a gorgeous, dark/light toggle switcher.
*   Amoled/Pitch Black Canvas: The theme utilizes pure black (`dark:bg-black`) backgrounds and charcoal/zinc containers (`dark:bg-zinc-950`) to reduce eye strain for agents working long shifts.
*   Clean Sidebar Pill Switcher: The toggle is beautifully positioned next to the agent profile pill at the bottom of the sidebar, separated by a vertical divider line.

### 5. Failed-Action Resolution Path
The resolution endpoint has a mock 30% failure rate. Instead of changing the button text or failing silently, we designed a sliding Error Toast Notification that pops up at the top-right corner. It features an interactive, keyboard-friendly Retry button and custom bounce animations, ensuring failures can be resolved with a single keystroke.

---

## Architecture & Tech Stack

*   Core: React 19 + TypeScript
*   Styling: Tailwind CSS for modern typography, responsive grids, and custom border/shadow highlights.
*   Icons: Lucide React for consistent vector icons (WhatsApp, Email, Live Chat channel badges).
*   State Management: React useReducer with a centralized hook (useConversations) for predictable event dispatching.
*   Network & Mocking: Mock Service Worker (MSW) simulating real network latency (200-500ms delay) and endpoints for fetching, assigning, replying, and resolving conversations.
*   Animations: Framer Motion for spring-based list entry transitions, smooth sidebar resizing, and fluid modal/toast overlays.
