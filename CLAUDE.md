# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **monorepo** containing three applications:

1. **admin** - Next.js 16 admin dashboard with Supabase authentication and data visualization
2. **agent** - Next.js web application for store/agent management
3. **agent-app** - React Native mobile app using Expo with Expo Router and EAS Workflows

## Architecture & Technology Stack

### Admin App (`apps/admin`)
- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3, Tailwind CSS 4.x
- **Database**: Supabase (via @supabase/supabase-js)
- **Auth**: Supabase SSR authentication with middleware-based route protection
- **Charts**: Recharts, @visx visualization libraries
- **Structure**:
  - Route groups: `(auth)`, `(dashboard)` for authenticated/dashboard areas
  - Feature-based organization: `app/features/` contains agents, auth, dashboard, products, records, intelligence
  - Server-side utilities: `app/server/` (db, services)
  - Shared components: `components/`
  - Supabase utilities: `utils/supabase/` (client, server, middleware, admin)

### Agent App (`apps/agent`)
- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3, Tailwind CSS 4.x
- **Features**: Store management, logging
- **React Compiler**: Enabled via babel-plugin-react-compiler

### Agent Mobile App (`apps/agent-app`)
- **Framework**: Expo SDK 54 with React Native 0.81
- **Navigation**: Expo Router (file-based routing)
- **Storage**: expo-sqlite for persistent local storage
- **CI/CD**: EAS Workflows (preview, development builds, production deployments)
- **Key packages**: expo-blur, expo-haptics, expo-image, react-native-reanimated, react-native-gesture-handler

## Development Guidelines

### Code Philosophy (from `.cursor/rules/simple-effective-output.mdc`)

- **Keep it simple**: Prefer plain, obvious solutions over clever ones
- **Small diffs**: Touch as few files and lines as necessary
- **Reuse patterns**: Follow existing codebase patterns; avoid new abstractions unless there are at least two real call sites
- **Logic proximity**: Keep logic close to where it's used unless clearly reused
- **Direct data flows**: Favor props, simple context/hooks over global state or complex indirection
- **TypeScript**: Practical and strict - avoid `any` but don't over-genericize
- **Comments**: Only for complex business logic or design decisions, not for restating obvious code

## Common Development Commands

### Admin & Agent Apps (Next.js)

```bash
# Navigate to app directory
cd apps/admin   # or apps/agent

# Development
npm run dev          # Start dev server (typically http://localhost:3000)
npm run build       # Production build
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Agent Mobile App (Expo)

```bash
# Navigate to app directory
cd apps/agent-app

# Development
npm run start                 # Start Expo dev server ( Metro bundler )
npm run start --clear         # Clear cache and start
npm run android              # Start on Android emulator
npm run ios                  # Start on iOS simulator
npm run web                  # Start in web browser

# Building & Testing
npx expo doctor              # Check project health
npx expo lint                # Run ESLint
npx expo install <package>   # Install Expo-compatible packages
npm run development-builds  # Create development builds via EAS

# Production
npm run draft                # Publish preview update
npm run deploy               # Deploy to production (workflow)
```

## Environment Configuration

- **Admin App**: Requires `.env.local` with Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- **Agent App**: No special environment variables identified
- **Agent Mobile App**: `.env.local` present for local configuration

## Routing & Navigation

### Next.js Apps (Admin & Agent)
- Uses App Router with `app/` directory
- Route groups (e.g., `(auth)`, `(dashboard)`) for layout grouping
- Server components by default; client components use `'use client'` directive
- Middleware-based authentication (admin app)

### Expo Mobile App
- File-based routing with Expo Router
- Routes in `app/` directory:
  - `_layout.tsx` - Root layout with theme provider
  - `(tabs)/` - Tab-based navigation screens
  - `auth/` - Authentication screens
  - `main/` - Main app screens

## Testing Approach

No explicit testing framework is configured. If adding tests:

- **Next.js apps**: Consider Jest + React Testing Library or Vitest
- **Expo app**: Consider Jest + React Native Testing Library
- Add component/testIDs for automation (MCP automation tools mentioned in agent-app AGENTS.md)

## Database & Backend

- **Supabase**: Used in admin app for PostgreSQL database and authentication
  - Client utilities in `utils/supabase/`
  - Server components in `app/server/` for database operations
  - Middleware handles session validation

## CI/CD

- **Admin & Agent**: Manual deployment (likely Vercel based on Next.js)
- **Agent Mobile App**: Automated via EAS Workflows (`.eas/workflows/`)
  - Profiles: development, preview, production
  - Commands: `npm run draft`, `npm run development-builds`, `npm run deploy`

## Important Files & Directories

- `apps/admin/middleware.ts` - Authentication middleware
- `apps/admin/utils/supabase/` - Supabase client setup
- `apps/agent-app/AGENTS.md` - Detailed Expo/React Native guidance
- `apps/agent-app/eas.json` - EAS build configuration
- `apps/agent-app/app.json` - Expo app configuration

## Package Management

- **pnpm**: Preferred for Next.js apps (pnpm-lock.yaml present)
- **npm**: Used in Expo app (package-lock.json present)
- No root workspace file detected; each app manages its own dependencies

## Linting & TypeScript

- **Admin & Agent**: ESLint 9 with eslint-config-next, TypeScript 5.x
- **Expo**: ESLint with eslint-config-expo, TypeScript ~5.8.3
- Config files: `eslint.config.mjs` (or `.js`), `tsconfig.json`

## Debugging & Tools

- **Next.js**: Use browser DevTools; Next.js DevTools available
- **Expo**: MCP `open_devtools` for React Native DevTools; network inspection; element inspector
- **Logging**: console.log/warn/error; error boundaries for production

## Notes

- This monorepo appears to be a bakery/retail management system with admin dashboard for oversight and a mobile app for field agents/stores
- Admin app includes modules for agents, products, records, intelligence/dashboards
- Agent mobile app uses SQLite for offline-first data persistence
- All apps are TypeScript-first with strong typing
