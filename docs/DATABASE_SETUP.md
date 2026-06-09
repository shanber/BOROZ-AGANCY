# Database Setup & Staging Guide - BOROZ Platform

This document describes the process of setting up a PostgreSQL database, configuring environment variables, running migrations via Prisma, and preparing the project for production deployment on Vercel.

> [!IMPORTANT]
> **ملاحظة مرحلية هامة حول هجرة الجداول (Staged Migration Note):**
> نظراً لأن قاعدة البيانات تحتوي على جداول منشأة مسبقاً (مثل `users`, `organizations`, `merchants`, إلخ) ولا يوجد لها تاريخ هجرة (Migration History) كامل في كود المشروع، تم إنشاء ملف هجرة يدوي مخصص لإضافة جدول الطلبات `orders` فقط (`20260607100000_add_orders_table`). 
> هذا يعني أن ملفات الهجرة الحالية لا تعالج أو تدير الجداول والبيانات السابقة، وإنما تقوم فقط بتدشين جدول الطلبات الجديد، وبالتالي يجب المحافظة عليها وعدم تشغيل `prisma migrate reset` في البيئات المشتركة لعدم حذف الجداول السابقة.

---

## 1. Database Hosting Recommendation
To match the requirements of the **MVP backend contract**, we recommend using serverless PostgreSQL providers:
* **Neon (Recommended):** Serverless PostgreSQL built for Next.js. Offers a generous free tier, fast response times, and branchable databases.
* **Supabase:** Managed PostgreSQL database with instant API integration and database triggers.

---

## 2. Environment Configuration
The application accesses the database using the `DATABASE_URL` environment variable defined in the datasource block of `prisma/schema.prisma`.

### Local Development Setup:
1. Create a `.env` file in the root directory (copied from `.env.example`).
2. Add your PostgreSQL connection URI:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:5432/database_name?schema=public"
   ```

> [!CAUTION]
> **Never commit your `.env` file containing real credentials to version control.** It is already listed in the `.gitignore` to prevent leaks.

---

## 3. Prisma Migration Commands

### A. Initializing and Running Migrations (Development)
To apply schema changes to your database and generate the client, run:
```bash
npx prisma migrate dev --name init_orders
```
This command:
1. Creates a SQL migration file inside the `prisma/migrations` directory.
2. Applies the migration to your database.
3. Automatically runs `prisma generate` to update the local `@prisma/client` library.

### B. Syncing Schema Without Migrations (Prototyping)
If you want to sync the schema directly to a staging database without creating migration history, run:
```bash
npx prisma db push
```

### C. Regenerating the Prisma Client manually
If you modify `schema.prisma` and need to regenerate the client types manually:
```bash
npx prisma generate
```

### D. Viewing Database Data (Prisma Studio)
To explore the database tables and records via an interactive GUI:
```bash
npx prisma studio
```

---

## 4. Vercel Production Setup

When deploying the BOROZ platform to Vercel, follow these steps to connect your database:

1. **Add Environment Variables:**
   * In your Vercel Project dashboard, go to **Settings** ➜ **Environment Variables**.
   * Add `DATABASE_URL` with the connection string of your production database.

2. **Configure Build Command:**
   * Vercel needs to run migrations during deployment. Update the build command in Vercel or modify `package.json` to pre-compile the client.
   * By default, our build script is configured. If needed, you can use the Vercel deploy command override:
     ```bash
     npx prisma generate && next build
     ```
   * To apply migrations automatically on every production release, you can append `prisma migrate deploy`:
     ```bash
     npx prisma migrate deploy && npx prisma generate && next build
     ```
