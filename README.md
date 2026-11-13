<p align="center">
  <img src="public/vedaflow-logo.svg" alt="VedaFlow Logo" width="380" />
</p>

<h1 align="center">VedaFlow — Enterprise CRM Platform</h1>

<p align="center">
  <strong>Modern, Full-Featured Enterprise CRM &amp; Sales Cockpit built with React 18, TypeScript &amp; Redux Toolkit.</strong><br>
  <em>Designed for sales representatives, account executives, customer success managers, and regional directors.</em>
</p>

<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.6-blue.svg" alt="TypeScript" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61dafb.svg" alt="React" /></a>
  <a href="https://redux-toolkit.js.org/"><img src="https://img.shields.io/badge/Redux_Toolkit-2.3-purple.svg" alt="Redux Toolkit" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg" alt="Tailwind CSS" /></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest-61_Tests_Passing-brightgreen.svg" alt="Vitest" /></a>
</p>

---

## 📌 Project Overview

**VedaFlow** is an enterprise-grade Customer Relationship Management (CRM) platform engineered for high-velocity sales organizations. It provides both an **Admin Operations Panel** and a dedicated **Representative User Panel (Personal Cockpit)** that empowers employees to manage their assigned leads, pipeline opportunities, customer accounts, critical deliverables, and performance analytics efficiently.

### 🇮🇳 Tailored for Indian Enterprise Ecosystems
- **Currency & Denominations**: Native Indian Rupee (`₹`) support with intelligent Lakhs (`₹ L`) and Crores (`₹ Cr`) compact valuation.
- **Enterprise Accounts**: Pre-configured accounts across major Indian sectors (TCS, Reliance Retail, Infosys, Razorpay, HDFC Securities, Titan, Swiggy).
- **Tax Compliance**: Built-in SAC 998313 GST tax quotation estimator supporting CGST/SGST (9%+9%) and IGST (18%).
- **Timezone**: India Standard Time (IST / Asia/Kolkata).

---

## 🌟 Core Modules & Capabilities

### 1. 🔐 Authentication & Password Recovery Flow (`src/modules/auth`)
- **Sign In**: Secure credentials login with quick-fill persona shortcuts (Sales Rep, AE, SDR Lead, Sales Director).
- **Forgot Password**: Multi-step recovery initiating dynamic OTP dispatch.
- **OTP Verification**: 6-digit auto-advancing verification code grid with 60-second resend countdown timer.
- **Reset Password**: Dynamic password strength meter (length, letters, numbers, symbols) and matching validation.
- **Sign Up**: New user registration with department and role assignment.

### 2. 📊 User Dashboard & Personal Cockpit (`src/modules/dashboard`)
- **Representative Welcome Header**: Live quota progress gauge, closed-won attainment pace, and quick-action shortcuts.
- **Workspace Scope Switcher (`Personal` vs `Team`)**: Synchronizes across all CRM modules to toggle between "My Assigned Records" and "All Organization Records".
- **Real-Time KPIs**: Dynamic cards for Assigned Leads, Active Deals, Ongoing Deliverables, and Win Ratios.
- **Integrated Widgets**: Scope-aware Action Items Widget, Strategic High-Value Deals Table, and Live Customer Activity Stream.

### 3. 🎯 Lead Management & Follow-Up Scheduler (`src/modules/leads`)
- **Lead Capture & Scoring**: Score-weighted lead pipeline (0–100) with estimated contract valuations.
- **Status Lifecycle**: Track leads through *New*, *Contacted*, *Qualified*, *Proposal*, *Negotiation*, *Converted*, and *Unqualified*.
- **Follow-up Scheduler Modal**: Schedule calls, meetings, demos, or emails with automated task creation and activity logging.
- **Scope Filters**: Instant toggle between "My Assigned Leads" and "All Organization Leads".

### 4. 💼 Sales Pipeline Kanban Board (`src/modules/pipeline`)
- **7-Stage Visual Pipeline**: *Discovery* → *Qualification* → *Proposal* → *Negotiation* → *Contract Sent* → *Closed Won* / *Closed Lost*.
- **Interactive Deal Cards**: Probability confidence meters, deal priority badges (*Urgent*, *High*, *Medium*, *Low*), and slip-risk flags.
- **Pipeline Scope**: Switch between "My Ongoing Deals" and "All Pipeline Deals".

### 5. 👥 Customer Management & Accounts (`src/modules/customers`)
- **Enterprise Customer Directory**: Complete client profiles with ARR, industry tags, account managers, and GSTIN.
- **Tier Categorization**: *Tier 1 Strategic*, *Tier 2 Enterprise*, and *Tier 3 Mid-Market*.
- **Customer Dossier**: Full profile view detailing contact information, linked pipeline deals, and historical touchpoint interactions.

### 6. ✅ Task Management & Action Items (`src/modules/tasks`)
- **Priority & Due Date Tracking**: *Urgent*, *High*, *Medium*, *Low* with visual overdue indicators.
- **Status Tabs**: *To Do*, *In Progress*, and *Completed* with 1-click checkbox completion.
- **Scope Awareness**: View "My Pending Tasks" vs "All Tasks".

### 7. 📞 Activity Tracking & Meeting Scheduler (`src/modules/activities`)
- **Multi-Channel Touchpoint Logging**: Record Calls, Video Meetings, Emails, Notes, and Deal Status Transitions.
- **AI Meeting Summarizer**: Extract key objections, decisions, and action items from call recordings.
- **Meeting Scheduler**: IST-localized demo slot scheduler generating instant invite links and reminder tasks.

### 8. 📈 Reports & Recharts Analytics (`src/modules/analytics`)
- **Personal Sales Performance Dashboard**:
  - **Revenue vs. Quota Pace**: Interactive Recharts AreaChart comparing actual closed earnings to quarterly targets.
  - **Lead Funnel Progression**: BarChart tracking conversion across pipeline stages.
  - **Task Distribution**: Donut PieChart depicting deliverable status distribution.
  - **Won vs. Lost Breakdown**: Commercial win rate analysis.
- **Export Engine**: Export full executive reports to **Microsoft Excel (UTF-8 BOM CSV)** or **Printable PDF Document**.

### 9. 🔔 Real-Time Notification Center (`src/modules/notifications`)
- **Alerts Hub**: Dedicated navigation module tracking lead assignments, upcoming client meetings, task deadlines, and pipeline stage changes.
- **Filtering & Search**: Filter by category (*All*, *Unread*, *Lead Assignments*, *Task Reminders*, *Meetings*, *Deal Stages*).
- **Direct Record Navigation**: 1-click jump to the relevant lead, deal, or customer record.

### 10. ⚙️ Profile Settings & Role-Based Access Control (`src/modules/auth`)
- **Personal Profile Management**: Update personal info, title, and upload custom avatars (with letter-initial fallback).
- **Password Security**: Password update form requiring current password verification and 8+ character validation.
- **Role-Based Permissions Matrix**: Explicitly displays permissions based on user role (Sales Rep, AE, SDR Lead, Sales Director).

---

## 🎨 Theme & UI/UX Design System

- **Sunset Copper (Default)**: Deep obsidian & dark espresso background (`#140e0c`) paired with warm metallic copper and rose-bronze accents (`#ca5e3a`, `#e08a68`, `#f59e0b`).
- **Additional Themes**: Sapphire Blue, Emerald Green, Violet, Rose, Amber, Cyan, and Indigo.
- **Responsive Layout**: Desktop table views, tablet navigation, and mobile cards/drawers for `< 640px` viewports.

---

## 🏗️ Clean Modern Folder Structure & Architecture

A flat, highly intuitive, and modular directory structure designed for 1-click developer navigation and instant onboarding.

```
enterprise-crm-platform/
├── public/                 # Static browser assets (Favicon, VedaFlow Logo)
├── src/                    # Application Source Code
│   ├── App.tsx             # Main Application root & view orchestrator
│   ├── main.tsx            # Vite DOM mount point & Redux Provider
│   ├── index.css           # Global Tailwind CSS styles & themes
│   ├── components/         # Reusable UI Design System (Button, Modal, Input, Card, Badge, etc.)
│   │   └── brand/          # VedaFlowLogo emblem & vector assets
│   ├── constants/          # Color themes (Sunset Copper, Sapphire, Emerald) & configurations
│   ├── data/               # Realistic Indian enterprise mock seed dataset (mockData.ts)
│   ├── hooks/              # Custom React hooks (e.g. useTabTitleMarquee)
│   ├── layout/             # Application chrome (Navbar, Sidebar, responsive Layout)
│   ├── modules/            # Self-contained business feature domains
│   │   ├── activities/     # Call/meeting logs, WhatsApp modal, AI summarizer
│   │   ├── analytics/      # Performance dashboard, commission calculator, exports
│   │   ├── auth/           # Dual-method login (Email & Mobile OTP), user profile
│   │   ├── customers/      # Enterprise client accounts & profiles
│   │   ├── dashboard/      # Executive sales cockpit, revenue & funnel charts
│   │   ├── leads/          # Lead lifecycle, scoring, and follow-up scheduler
│   │   ├── notifications/  # Notification center alerts & unread badges
│   │   ├── pipeline/       # 7-stage Kanban pipeline, GST quotations, deal cards
│   │   └── tasks/          # Task queues with priority badges & due dates
│   ├── store/              # Central Redux store (index.ts) & UI state (uiSlice.ts)
│   ├── types/              # Strict TypeScript domain interfaces (crm.ts)
│   ├── utils/              # GST quotation, deal health, currency & report exports
│   └── test/               # 16 Vitest automated test suites (61 unit tests)
└── (Config files)          # vite.config.ts, tailwind.config.js, tsconfig.json
```

### 📂 Directory Responsibilities

| Directory | Responsibility & Contents |
|---|---|
| **`public/`** | Static assets served directly without bundling (`favicon.svg`, `vedaflow-logo.svg`). |
| **`src/App.tsx`** | Top-level application shell rendering active view, layout, and global modals. |
| **`src/components/`** | Atomic UI library: `Button`, `Input`, `Modal`, `Card`, `Badge`, `Avatar`, `Toast`, `StatCard`, `EmptyState`. |
| **`src/store/`** | Central **Redux Toolkit** store configuration (`index.ts`) and global UI/theme slice (`uiSlice.ts`). |
| **`src/modules/`** | Business domains: `auth`, `dashboard`, `leads`, `pipeline`, `customers`, `tasks`, `activities`, `analytics`, `notifications`. |
| **`src/layout/`** | App navigation chrome: `Sidebar.tsx`, `Navbar.tsx`, and responsive `Layout.tsx`. |
| **`src/types/`** | Strict TypeScript interfaces (`crm.ts`) for Leads, Deals, Customers, Tasks, Activities, and Team Members. |
| **`src/utils/`** | Business logic: `gstQuotation.ts` (18% IGST / 9%+9% CGST+SGST), `dealHealth.ts`, `randomDataGenerator.ts`, `formatters.ts` (₹ Lakhs / Crores), `exportReport.ts` (Excel CSV & PDF). |
| **`src/hooks/`** | Custom React hooks (e.g., `useTabTitleMarquee.ts` for dynamic tab notifications). |
| **`src/data/`** | Pre-configured realistic enterprise dataset (`mockData.ts`). |
| **`src/test/`** | **16 Vitest test suites (61 unit tests)** verifying all business logic and Redux slices. |

### 🔄 Data Flow (How It Connects)

```
[ User Interaction ] ──> [ Redux Slice Action ] ──> [ Store & localStorage ] ──> [ Reactive UI Update ]
   (Click / Form)           (e.g., addDeal, login)       (Instant Persistence)       (Kanban, Charts, Toasts)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation
```bash
# Clone repository and navigate to project root
git clone <repo-url>
cd "Enterprise CRM Platform (user side)"

# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### Running Automated Tests
```bash
npm test
```
Executes all 16 test suites and 61 unit tests with Vitest and JSDOM.

### Building for Production
```bash
npm run build
```
Compiles TypeScript via `tsc -b` and bundles optimized production assets via Vite into `/dist` with zero warnings or errors.

---

## 🛡️ License
Private Enterprise Platform — Copyright © 2026 VedaFlow Technologies India Pvt. Ltd. All Rights Reserved.
