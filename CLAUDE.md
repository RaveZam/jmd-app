# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo for a bakery/retail distribution management system with three apps:

1. **admin** (`apps/admin`) - Next.js 16 admin dashboard; Supabase auth, data visualization
2. **agent** (`apps/agent`) - Next.js 16 web app for store/agent management
3. **agent-app** (`apps/agent-app`) - Expo React Native mobile app for field agents

## Code Philosophy

From `.cursor/rules/simple-effective-output.mdc`:

- **Keep it simple**: Prefer obvious solutions over clever ones
- **Small diffs**: Touch as few files/lines as necessary
- **Reuse patterns**: Follow existing patterns; no new abstractions without 2+ real call sites
- **Logic proximity**: Keep logic close to where it's used unless clearly reused
- **Direct data flows**: Props and simple context/hooks over global state
- **TypeScript**: Practical and strict — avoid `any` but don't over-genericize
- **Comments**: Only for complex business logic, not to restate obvious code

## Development Commands

### Admin & Agent (Next.js)

```bash
cd apps/admin   # or apps/agent
npm run dev     # Dev server
npm run build   # Production build
npm run lint    # ESLint
```

> Use **pnpm** in the Next.js apps (pnpm-lock.yaml present).

### Agent Mobile App (Expo)

```bash
cd apps/agent-app
npm run start               # Start Metro bundler
npm run start --clear       # Clear cache and start
npm run android             # Android emulator
npm run ios                 # iOS simulator
npx expo lint               # Lint
npx expo install <package>  # Install Expo-compatible packages

# EAS
npm run development-builds  # Create dev build via EAS
npm run draft               # Publish preview update
npm run deploy              # Deploy to production
```

> Use **npm** in the Expo app (package-lock.json present).

## Admin App Architecture

- **Route groups**: `(auth)` and `(dashboard)` for layout separation
- **Feature modules**: `app/features/` — agents, auth, dashboard, products, records, intelligence
- **Server layer**: `app/server/` — db and service utilities (server components only)
- **Supabase utilities**: `utils/supabase/` — client, server, middleware, admin variants
- **Auth**: Middleware-based session validation (`middleware.ts`)
- **Charts**: Recharts + @visx

## Agent Mobile App Architecture

### Feature-Based Structure

```
src/features/
  auth/         # useLogin hook, sign-in screen
  routes/       # Route management (main feature)
    screens/    # SelectRouteScreen, ListRouteScreen
    components/ # RouteComponents (StoreCard, TenderedCard), createRouteModal
    hooks/      # useGetRoutes
    services/   # routesServices, routeSaveService
    types/      # Route, CreateRouteDraft, DraftProvince, DraftStore
  store/        # Distribution log (useDistributionLog, ProductLogForm)
  settings/     # Settings screen
lib/
  sqlite/
    db-migration.ts         # DB init (called on app launch)
    dao/
      routes-dao.ts         # getAllRoutes, insertRoute
      province-dao.ts       # insertProvince
      store-dao.ts          # insertStore
  supabase.ts               # Supabase client (expo-sqlite/localStorage for session)
```

### SQLite Database Layer

Database: `routeledger.db` opened via `expo-sqlite`. Initialized in `app/_layout.tsx` via `initDb()`.

**Schema:**

```sql
routes     (id TEXT PK, name TEXT NOT NULL)
provinces  (id TEXT PK, name TEXT NOT NULL, route_id FK)
stores     (id TEXT PK, name, province_id FK, address, contact_number, contact_name)
```

**Patterns:**

- All DAOs use **synchronous** API: `db.runSync()`, `db.getAllSync()`
- IDs are UUIDs generated via `uuid` v4 package (`uuidv4()`)
- Multi-table inserts wrapped in `db.withTransactionSync()` (see `routeSaveService`)
- No versioned migrations — tables created with `IF NOT EXISTS`

### Navigation (Expo Router)

File-based routing under `app/`. Key routes:

- `app/index.tsx` → re-exports `/main/routes/index` (home)
- `app/auth/sign-in.tsx` → sign-in screen
- `app/main/routes/index.tsx` → SelectRouteScreen
- `app/main/routes/list.tsx` → ListRouteScreen
- `app/main/routes/store/[storeId].tsx` → dynamic store detail
- `app/main/settings/index.tsx` → settings

**Navigation patterns:**

```typescript
// Typed params
const params = useLocalSearchParams<{ routeId?: string; routeName?: string }>();

// Navigate with params
router.push({ pathname: "/main/routes/list", params: { routeId, routeName } });

// Auth redirect (prevent back nav)
router.replace("/auth/sign-in");
```

**Auth guard** in `app/_layout.tsx`: checks `supabase.auth.getSession()` on mount, redirects unauthenticated users to `/auth/sign-in`, redirects authenticated users away from auth routes.

### Styling Conventions

- All styles via `StyleSheet.create()` (React Native)
- Flexbox for layout; `SafeAreaView` wraps screens
- Theme colors from `constants/Colors.ts` (light/dark variants)
- Reusable header: `components/ui/header.tsx` (back button, title, right element slot)
- FABs: absolutely positioned with `expo-linear-gradient` backgrounds
- Cards: `borderRadius: 8`, `borderColor: "#E5E7EB"`

## Environment Variables

- **Admin app**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- **Agent mobile app**: Supabase credentials in `.env.local`

## Key Reference Files

- `apps/agent-app/AGENTS.md` — detailed Expo/React Native guidance, MCP debug commands
- `apps/agent-app/eas.json` — build profiles (development, preview, production)
- `apps/agent-app/app.json` — Expo config (SDK 54, new arch enabled, typedRoutes)
- `.cursor/rules/simple-effective-output.mdc` — code philosophy
