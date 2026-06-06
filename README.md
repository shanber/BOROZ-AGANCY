# Salla Marketing Platform - MVP
## منصة تسويق وخدمات رقمية متكاملة

**Version**: 0.1.0 (Phase 1)  
**Status**: Phase 1 - Setup & UI (Complete ✅)

---

## 📋 نظرة عامة

منصة **SaaS متكاملة** لتجار سلة لطلب ومتابعة خدمات التسويق والتصميم. المنصة مبنية على:

- **Next.js 14** (App Router)
- **TypeScript** (Strict Mode)
- **Tailwind CSS** (with RTL support)
- **Prisma** (PostgreSQL)
- **NextAuth** (coming in Phase 2)

---

## 🚀 البدء السريع

### المتطلبات
- Node.js >= 18.17.0
- PostgreSQL (or Neon)
- npm or yarn

### التثبيت

```bash
# 1. Clone the repository
git clone <repo-url>
cd salla-marketing-mvp

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Configure database in .env.local
# DATABASE_URL="postgresql://user:password@localhost:5432/salla_marketing"

# 5. Run Prisma migrations
npm run prisma:push

# 6. Seed database
npm run prisma:seed

# 7. Start development server
npm run dev
```

**سيكون التطبيق متاحاً على**: `http://localhost:3000`

---

## 📐 البنية المعمارية

### Database Schema

```
Organization (Tenant)
├─ OrganizationMember (RBAC)
├─ OrganizationPlan (SaaS Plans)
├─ Merchant (Salla Merchants)
├─ Lead (CRM - Potential Customers)
├─ Service (Global System Services)
├─ ServiceOrder (Customer Orders)
├─ Project (Project Management)
├─ Task (Task Management)
├─ FileAsset (File Attachments)
├─ LandingPage (Landing Pages)
├─ Notification (In-App Notifications)
└─ ActivityLog (Audit Trail)
```

### Folder Structure

```
app/
├─ (auth)/                 # Authentication pages
│  ├─ login/
│  ├─ register/
│  └─ layout.tsx
├─ (dashboard)/            # Dashboard pages
│  ├─ merchants/
│  ├─ leads/
│  ├─ orders/
│  ├─ projects/
│  ├─ tasks/
│  ├─ reports/
│  ├─ settings/
│  └─ layout.tsx
├─ api/                    # API routes (Phase 2+)
├─ components/
│  ├─ ui/                  # Base UI components
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  │  ├─ Card.tsx
│  │  ├─ Badge.tsx
│  │  ├─ Sidebar.tsx
│  │  └─ Topbar.tsx
│  └─ ...
├─ lib/
│  ├─ prisma.ts           # Prisma client
│  ├─ auth.ts             # Auth helpers
│  ├─ constants.ts        # Enums & constants
│  ├─ types.ts            # TypeScript types
│  └─ utils.ts            # Utility functions
├─ globals.css            # Global styles
├─ layout.tsx             # Root layout
└─ page.tsx               # Home page redirect
```

---

## 🎨 الميزات المتاحة في Phase 1

### ✅ Completed
- [x] Next.js 14 setup
- [x] TypeScript strict mode
- [x] Tailwind CSS + RTL support
- [x] Prisma with PostgreSQL
- [x] Database schema (14 models)
- [x] Seed data script
- [x] Base UI components (Button, Input, Card, Badge)
- [x] Layout system (Sidebar, Topbar)
- [x] Authentication pages (UI only - no backend)
- [x] Dashboard page (mock data)
- [x] Placeholder pages for future phases
- [x] Type definitions & constants
- [x] Utility functions & helpers
- [x] Environment configuration

### ⏳ Coming in Phase 2+
- [ ] NextAuth implementation
- [ ] User registration & login
- [ ] Multi-tenant isolation
- [ ] RBAC enforcement
- [ ] CRM (Merchants & Leads)
- [ ] Orders management
- [ ] Projects & Tasks
- [ ] Landing Pages
- [ ] Reports & Analytics
- [ ] File uploads
- [ ] Notifications system
- [ ] Email/SMS integration

---

## 🔑 Demo Credentials

```
📧 Email: admin@example.com
🔐 Password: ChangeMe123!
```

*Note: Authentication is not yet implemented. These are for reference only.*

---

## 📝 الأوامر المتاحة

```bash
# Development
npm run dev              # Start dev server

# Build & Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run prisma:migrate   # Create migrations
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Run seed script
npm run prisma:studio    # Open Prisma Studio

# Linting
npm run lint             # Run ESLint
```

---

## 🗄️ Database Configuration

### Neon (Recommended for MVP)

```bash
# 1. Create account at https://neon.tech
# 2. Copy connection string
# 3. Add to .env.local:
DATABASE_URL="postgresql://user:password@ep-*.neon.tech/neon?sslmode=require"
```

### Local PostgreSQL

```bash
# 1. Install PostgreSQL
# 2. Create database
createdb salla_marketing

# 3. Add to .env.local:
DATABASE_URL="postgresql://postgres:password@localhost:5432/salla_marketing"
```

---

## 🔐 Security Checklist

- [x] Environment variables (.env.local)
- [x] Prisma client singleton pattern
- [x] TypeScript strict mode
- [x] Input validation utilities
- [x] Password hashing helpers (bcryptjs)
- [ ] Authentication middleware (Phase 2)
- [ ] CSRF protection (Phase 2)
- [ ] Rate limiting (Phase 2)
- [ ] SQL injection prevention (via Prisma)

---

## 📊 الأدوار (Roles)

```
SUPER_ADMIN     → Founder - Full access
ADMIN           → Organization admin
PROJECT_MANAGER → Manage projects & team
DESIGNER        → Execute design tasks
MARKETER        → CRM & marketing
CLIENT          → Merchant (read-only)
```

---

## 💳 SaaS Plans

```
FREE        → 10 leads/month
STARTER     → 100 leads/month
PRO         → 1000 leads/month
ENTERPRISE  → Unlimited
```

*Billing implementation coming in Phase 3+*

---

## 🌐 Services (Global)

The platform provides a global set of services that all organizations can use:

- Logo Design
- Website Development
- Social Media Management
- SEO Optimization
- Content Writing

*Organization-specific services coming in Phase 3+*

---

## 🗑️ Soft Deletes

The following models support soft deletes (deletedAt field):

- Merchant
- Lead
- ServiceOrder
- Project
- Task

No business records are permanently deleted from the database.

---

## 🎯 Phase Plan

| Phase | Duration | Focus |
|-------|----------|-------|
| **1** | Week 1-2 | ✅ Setup & UI (CURRENT) |
| **2** | Week 2-3 | Auth & Multi-tenant |
| **3** | Week 3-4 | Layout & Base components |
| **4** | Week 4-5 | Dashboard & Stats |
| **5-7** | Weeks 5-10 | CRM, Orders, Projects |
| **8** | Week 11 | Landing Pages & Reports |
| **9** | Week 12 | RBAC & Settings |
| **10** | Week 13 | Testing & Deployment |

---

## 📚 Documentation

- **Database**: See `DATABASE.md`
- **API**: See `API.md` (coming Phase 2)
- **Architecture**: See architecture decisions documents

---

## 🤝 Contributing

This is a solo founder MVP. Contributions will be managed differently in Phase 2+.

---

## 📞 Support

For issues and questions, please refer to the GitHub issues tracker.

---

## 📄 License

TBD

---

## 🚦 Current Status

```
Phase 1: COMPLETE ✅
├─ Next.js Setup ✅
├─ TypeScript Setup ✅
├─ Tailwind Setup ✅
├─ Prisma Setup ✅
├─ Folder Structure ✅
├─ Layout System ✅
├─ Base Components ✅
├─ Database Schema ✅
├─ Seed Data ✅
└─ Environment Config ✅

Ready for Phase 2 ➡️ NextAuth & Multi-tenant
```

---

**Last Updated**: June 2024  
**Next Phase**: Phase 2 - Authentication & Multi-Tenant Implementation
