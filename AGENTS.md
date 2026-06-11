# BOROZ — Agent Guide

## Tech Stack
- **Framework**: Next.js 14 App Router + TypeScript (strict mode, `noUnusedLocals`/`noUnusedParameters`)
- **Styling**: Tailwind CSS with `tailwindcss-rtl` plugin (Arabic RTL), Rubik font, `@tailwindcss/typography`
- **Database**: Prisma ORM + PostgreSQL (Neon recommended), multi-tenant via `orgId`
- **Auth**: NextAuth v4 credentials provider, JWT strategy, bcryptjs
- **State**: Zustand for client state
- **Icons**: lucide-react

## Path Aliases (from `tsconfig.json`)
- `@/*` → `./*`
- `@/components/*` → `./app/components/*`
- `@/lib/*` → `./app/lib/*`
- `@/prisma/*` → `./prisma/*`

## Commands
```bash
npm run dev           # next dev → http://localhost:3000
npm run build         # prisma generate && next build (NOT plain next build)
npm run lint          # next lint (ESLint next/core-web-vitals)
npm run prisma:push   # prisma db push (sync schema without migration history)
npm run prisma:migrate # prisma migrate dev (create + apply migration)
npm run prisma:studio # prisma studio (GUI data browser)
npm run prisma:seed   # node prisma/seed.ts — LIKELY BROKEN (see DB note)
```

## DB / Prisma Gotchas
- `prisma/seed.ts` is **excluded from tsconfig compilation** and imports `hashPassword` from `@/lib/auth`, but the current `app/lib/auth.ts` only exports `authOptions` (NextAuth config). Running `npm run prisma:seed` will fail. Use `prisma/seed-services.js` instead for seeding the service taxonomy.
- The `orders` table was added via a **manual staged migration** on top of pre-existing tables not tracked in project migrations. **Do not run `prisma migrate reset`** — it would destroy untracked tables.
- `DIRECT_URL` env var is required (used in `schema.prisma` datasource for Neon).
- Soft deletes (`deletedAt`) on: `Merchant`, `Lead`, `ServiceOrder`, `Project`, `Task`.

## Middleware & Auth
- All `/dashboard/*` routes are auth-protected via `middleware.ts`.
- Role-based redirects: `ADMIN` → `/dashboard/admin/requests`, `PROVIDER` → `/dashboard/provider/pending` (if unapproved), `MERCHANT` → `/dashboard`.
- Session includes custom fields: `globalRole`, `approvalStatus`, `orgId`, `merchantId`, `storeName`, `storeUrl` (see `types/next-auth.d.ts`). These are added in NextAuth JWT callbacks.
- The `authOptions` export is in `app/lib/auth.ts`. Credentials provider only (email + password).

## Project Structure
- `app/` — Next.js 14 App Router pages and layouts
- `app/api/` — API routes (admin, auth, orders, services)
- `app/lib/` — Utilities, Prisma client singleton, auth, service taxonomy
- `app/components/` — UI components, layout shell, order/provider components
- `prisma/schema.prisma` — 16+ models including Order, ExpertProfile, Service, etc.
- `docs/` — PRODUCT_COMMUNICATION_POLICY.md (in-platform communication only), API_CONTRACT_ORDERS.md

## Roles
- **Global** (on User): `MERCHANT`, `PROVIDER`, `ADMIN`
- **Org-level** (on OrganizationMember): `SUPER_ADMIN`, `ADMIN`, `PROJECT_MANAGER`, `DESIGNER`, `MARKETER`, `CLIENT`, `EXPERT`

## Product Rules (Enforce These)
- No fake public stats or ratings.
- No implied partnership with Salla, Tamara, Tabby, Google, Meta, or SMSA.
- All numbers must use Western digits (`1234`), not Arabic-Indic.
- Pending providers are not called "approved experts".
- After project matching, all communication must be inside BOROZ (see `docs/PRODUCT_COMMUNICATION_POLICY.md`).
- Service availability (`isAvailable`) must be provider-driven — a service with zero approved providers shows `isAvailable: false`.

## BOROZ Product Architect Agent
- BOROZ is a managed execution platform, not an agency, freelancer directory, or open marketplace.
- Public UI must explain this execution path clearly: `Request → Review → Offers → Execution → Delivery`.
- Complete one workflow or page fully before moving to the next workflow or page.
- No fake stats, no fake partners, and no `coming soon` language on the public homepage.
- Current requestable public services are only:
  - `تخصيص متاجر سلة`
  - `تحسين SEO`
  - `صفحات الهبوط`

## Security Rules (Must Enforce)
- `ADMIN` routes must be admin-only.
- `PROVIDER` users must not access the provider dashboard before approval; they belong on `/dashboard/provider/pending` until approved.
- `MERCHANT` data must remain isolated by `userId` ownership and existing scoped access rules.
- `internalNote` must never be exposed to merchants in UI or API responses intended for merchant use.

## Development Rules
- Always inspect relevant files and current behavior before editing.
- Do not change `prisma/schema.prisma` unless explicitly approved by the user.
- Do not modify API logic unless the task requires it for functional compatibility.
- Always run `npm run build` after code changes and report the result.

## Preferred Implementation Order
- Finish public homepage.
- Finish request flow.
- Stabilize admin review.
- Then design provider offers.
- Then projects, contracts, and payments.

## Agent Modes

### Product Architect Agent
- Responsibility: guard BOROZ positioning, workflow clarity, page sequencing, and product consistency across tasks.
- May edit: public page messaging, workflow structure, request-flow UX, product-facing documentation, and instruction files like `AGENTS.md` when asked.
- Must not edit: Prisma schema, API business logic, auth rules, or dashboards unless the task explicitly requires it.
- Required output format:
  - `Scope:`
  - `Product Decision:`
  - `Files Changed:`
  - `Build Result:`
  - `Next Recommended Workflow:`

### Frontend UI Agent
- Responsibility: implement polished BOROZ UI using the existing navy/cyan premium SaaS design system with strong RTL/mobile behavior.
- May edit: `app/`, `app/components/`, styling classes, visual hierarchy, copy placement, and request-related/public UI components within task scope.
- Must not edit: Prisma schema, database structure, auth logic, middleware, or API logic unless explicitly required.
- Required output format:
  - `UI Goal:`
  - `Files Changed:`
  - `Visual/UX Changes:`
  - `Build Result:`

### Backend Security Agent
- Responsibility: protect route access, role boundaries, merchant isolation, approval gating, and data exposure rules.
- May edit: auth-related server code, middleware, route guards, API response shaping, and ownership checks only when the task explicitly needs security or access-control work.
- Must not edit: marketing copy, unrelated public UI, or schema structure unless explicitly approved.
- Required output format:
  - `Security Scope:`
  - `Risk Addressed:`
  - `Files Changed:`
  - `Validation Performed:`
  - `Build Result:`

### QA Agent
- Responsibility: review implemented work for regressions, rule violations, incomplete flows, misleading messaging, and missing validation.
- May edit: only when explicitly asked to fix issues discovered during QA; otherwise review and report findings only.
- Must not edit: unrelated code, product scope, or database structure during review-only tasks.
- Required output format:
  - `Findings:`
  - `Severity:`
  - `Files Referenced:`
  - `Gaps / Follow-up:`

## How To Invoke Agent Modes In Prompts
- Product Architect Agent:
  - `Act as the BOROZ Product Architect Agent for this task.`
- Frontend UI Agent:
  - `Act as the BOROZ Frontend UI Agent for this task.`
- Backend Security Agent:
  - `Act as the BOROZ Backend Security Agent for this task.`
- QA Agent:
  - `Act as the BOROZ QA Agent for this task.`

## Testing
No test framework is configured. There are no test scripts or test runner dependencies.

## Orders API
- The MVP uses a **localStorage fallback** pattern (`boroz_custom_orders` key). `POST /api/orders` writes to both DB and localStorage; dashboard merges both sources and deduplicates by `id`. See `docs/API_CONTRACT_ORDERS.md`.

## Deployment
- Vercel-ready: build command is `prisma generate && next build` (already in package.json).
- `.vercel/` directory is gitignored.
- Node engine: `>=18.17.0`.
