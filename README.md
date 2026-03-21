# JMD Bakery Distribution Management System

A monorepo for managing bakery/retail distribution operations — tracking field agents, store visits, sales records, and route sessions across three interconnected apps.

---

## Apps

| App                  | Path             | Purpose                                      | Stack                                           |
| -------------------- | ---------------- | -------------------------------------------- | ----------------------------------------------- |
| **Admin Dashboard**  | `apps/admin`     | Data visualization, records, agent oversight | Next.js 16, Supabase, Recharts, Tailwind CSS v4 |
| **Agent Mobile App** | `apps/agent-app` | Field agent operations (offline-capable)     | Expo SDK 54, React Native, SQLite               |

---

## Getting Started

> Use **pnpm** in the Next.js apps and **npm** in the Expo app.

### Admin Dashboard

```bash
cd apps/admin
pnpm install
pnpm dev
```

### Agent Web App

```bash
cd apps/agent
pnpm install
pnpm dev
```

### Agent Mobile App

```bash
cd apps/agent-app
npm install
npm run start          # Start Metro bundler
npm run android        # Android emulator
npm run ios            # iOS simulator
```

### Environment Variables

Both web apps require a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

The mobile app also requires Supabase credentials in `.env.local`.

---

## Admin Dashboard (`apps/admin`)

A Next.js admin panel connected to Supabase for real-time data management.

**Features:**

- **Dashboard** — Key metrics overview
- **Agents** — Agent accounts, performance, and session stats
- **Records** — Read-only sales master ledger with date/agent/session filters
- **Sessions** — Route session tracking and summaries
- **Stores** — Store catalog management
- **Products** — Product catalog
- **Intelligence** — Analytics, forecasting, and business rules
- **AI Chat** — Chatbot interface (mockup)

**Architecture:**

```g
app/
├── (auth)/           # Login route group
├── (dashboard)/      # Protected dashboard routes
├── features/         # Feature modules (agents, records, sessions, etc.)
├── server/           # Server-only utilities
└── layout.tsx
utils/supabase/       # Supabase client, server, middleware, admin clients
lib/
├── intelligence/     # Analytics computation (compute, forecast, rules, snapshot)
└── selectors/        # Data selectors for metrics and filters
middleware.ts         # Auth session validation
```

---

## Agent Web App (`apps/agent`)

A lightweight Next.js portal for store and agent management.

**Features:**

- Store listing and detail views
- Add store functionality

---

## Agent Mobile App (`apps/agent-app`)

An Expo React Native app for field agents to manage daily distribution routes. Works offline via SQLite with a Supabase sync queue.

**Features:**

- **Routes** — Select and manage distribution routes
- **Store Visits** — Log visits to stores within a route session
- **Distribution Log** — Record product sales and backorders per store
- **Authentication** — Supabase-backed sign-in

**Architecture:**

```
app/                          # Expo Router file-based routes
src/features/
├── auth/                     # Login screen and hook
├── routes/                   # Route selection, listing, screens, services
├── store/                    # Distribution log, product form
└── settings/                 # Settings screen
lib/
├── sqlite/
│   ├── db-migration.ts       # DB initialization (called on app launch)
│   └── dao/                  # Data access objects (routes, stores, sales, etc.)
├── sync/                     # Supabase outbox sync logic
└── supabase.ts               # Supabase client
```

**SQLite Schema:**

```
routes           id, name
provinces        id, name, route_id
stores           id, name, province_id, city, barangay, contact_*
route_sessions   id, route_name, session_date, conducted_by, status
session_stores   id, route_session_id, store_id, visited
products         id, name, price
sales            id, session_store_id, product_id, qty_sold, qty_bo, total
outbox           id, type, payload, priority, status  (sync queue)
```

- All DB access is synchronous (`db.runSync`, `db.getAllSync`)
- Multi-table inserts use `db.withTransactionSync()`
- IDs are UUIDs generated via the `uuid` package

**EAS Builds:**

```bash
npm run development-builds   # Dev build via EAS
npm run draft                # Preview update
npm run deploy               # Production deployment
```

---

## Key Reference Files

| File                                        | Purpose                                                    |
| ------------------------------------------- | ---------------------------------------------------------- |
| `CLAUDE.md`                                 | Project guidance for Claude Code                           |
| `apps/agent-app/AGENTS.md`                  | Detailed Expo/React Native guidance and MCP debug commands |
| `apps/agent-app/eas.json`                   | EAS build profiles                                         |
| `apps/agent-app/app.json`                   | Expo config (SDK 54, new arch enabled)                     |
| `.cursor/rules/simple-effective-output.mdc` | Code philosophy rules                                      |
