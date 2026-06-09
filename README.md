# BOROZ / بروز

## منصة خدمات متاجر سلة

BOROZ is a specialized marketplace for Salla merchants. It connects merchants with reviewed service providers and freelancers to execute store-related service requests with clear scope, organized workflow, and protected rights for both sides.

The platform is focused on Salla store services, provider onboarding, request management, and a future controlled project workflow inside BOROZ.

BOROZ is not a generic SaaS, CRM, or marketing agency.

BOROZ is an independent platform and is not officially affiliated with, endorsed by, or partnered with Salla or the listed third-party tools unless explicitly stated.

---

## Project Overview

BOROZ helps Salla merchants submit service requests, track their orders, and eventually compare provider offers, approve contracts, manage project delivery, and keep project communication inside the platform.

The current product direction is a managed marketplace:

- Merchants create service requests from an authenticated dashboard.
- Providers apply to join BOROZ, select service specialties, and submit portfolio/work samples.
- Admin reviews provider applications before providers can operate in the platform.
- Future project work should be handled through a BOROZ project or order workspace.

---

## Current Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL / Neon
- NextAuth
- RTL Arabic UI

---

## Current Implemented Features

- Authentication with NextAuth
- Merchant registration
- Provider registration
- Provider service selection during onboarding
- Portfolio/work samples requirement for providers
- Admin provider approval workflow
- Role-based dashboard navigation
- Merchant dashboard
- Real merchant request flow
- Orders scoped to the current merchant
- Western digits formatting across UI
- Placeholder pages for future modules

---

## Current Roles

### ADMIN

Manages provider approval and platform operations.

### MERCHANT

Creates and tracks service requests for their Salla store.

### PROVIDER

Applies as a service provider, selects services, submits portfolio/work samples, and waits for admin approval.

---

## Current Main Routes

- `/`
- `/login`
- `/register`
- `/register/merchant`
- `/register/provider`
- `/dashboard`
- `/dashboard/orders`
- `/dashboard/orders/new`
- `/dashboard/orders/[id]`
- `/dashboard/offers`
- `/dashboard/contracts`
- `/dashboard/files`
- `/dashboard/invoices`
- `/dashboard/messages`
- `/dashboard/settings`
- `/dashboard/admin/providers`
- `/dashboard/admin/providers/[id]`
- `/dashboard/provider/pending`
- `/request`

---

## Database / Prisma Overview

Important current models include:

- `User`: authenticated platform users with role assignment.
- `Organization`: merchant/store organization context.
- `OrganizationMember`: links users to organizations.
- `ExpertProfile`: provider profile and approval status.
- `ServiceCategory`: global service categories.
- `Service`: available service definitions.
- `ExpertService`: provider-to-service specialization mapping.
- `PortfolioItem`: provider portfolio/work samples.
- `Order`: merchant service requests scoped to the owning merchant/user. Order ownership is scoped through `userId`, `orgId`, and `merchantId` where available, so merchants only see their own requests.

---

## Development Setup

```bash
npm install
```

Copy `.env.example` to `.env`, then configure the database connection:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXTAUTH_SECRET="replace-with-a-local-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Generate Prisma Client and sync the database schema:

```bash
npx prisma generate
npx prisma db push
```

Windows PowerShell note: if script execution policy blocks `npx`, use the Windows command shim instead:

```bash
npx.cmd prisma generate
npx.cmd prisma db push
```

Start the development server:

```bash
npm run dev
```

The app runs locally at:

```text
http://localhost:3000
```

---

## Environment Variables

Use examples only. Do not commit real secrets.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXTAUTH_SECRET="replace-with-a-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Current Phase

The platform is in early MVP development.

Implemented:

- Core authentication
- Provider onboarding
- Admin provider approval
- Merchant request creation
- Merchant-scoped order visibility

Not implemented yet:

- Offers
- Contracts
- Payments
- Project workspace
- Chat
- Escrow

---

## Roadmap

Next phases:

- Admin request review
- Provider offers
- Merchant offer selection
- Contract generation
- Project workspace
- In-platform chat/files
- Delivery/revisions
- Payments/escrow later

---

## Important Product Rules

- No fake public stats.
- No fake ratings.
- No off-platform communication after a project starts.
- Public homepage must not imply official partnership with Salla, Tamara, Tabby, Google, Meta, or SMSA.
- All numbers must use Western digits such as `1234`, not Arabic-Indic digits.
- Pending providers are not called approved experts.

Project communication policy:

After a merchant request is accepted and a provider/freelancer is selected or assigned, all project-related communication must happen inside BOROZ. The general inbox can exist as a notification center, but actual project communication must live inside the project/order workspace.

See: `docs/PRODUCT_COMMUNICATION_POLICY.md`

---

## Notes For Contributors

Keep the product focused on the BOROZ marketplace model:

- Merchant request intake
- Reviewed provider onboarding
- Admin-mediated approval and review flows
- Protected project execution inside BOROZ

Do not add offers, contracts, payments, chat, project workspace, or escrow until their planned phase.
