# Read raw DDL
$ddl = Get-Content -LiteralPath "$env:TEMP\boroz_full_ddl.sql" -Raw

# === 1. Transform CREATE TYPE to DO blocks ===
$ddl = [regex]::Replace($ddl, 'CREATE TYPE "(\w+)" AS ENUM \(([^;]+)\);', {
    param($m)
    $name = $m.Groups[1].Value
    $values = $m.Groups[2].Value.Trim()
    "DO `$`$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '$name') THEN CREATE TYPE `"$name`" AS ENUM ($values); END IF; END`$`$;"
})

# === 2. Transform CREATE TABLE to CREATE TABLE IF NOT EXISTS ===
$ddl = $ddl -replace 'CREATE TABLE "', 'CREATE TABLE IF NOT EXISTS "'

# === 3. Insert missing columns BEFORE indexes section ===
# The first -- CreateIndex marks the boundary between tables and indexes.
# This ensures columns exist before indexes/FKs reference them.
$missingColumns = @'

-- Missing columns for existing tables (never added by migrations 1-5)
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "selectedOfferId" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "offersOpenedAt" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "offersClosedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "storeName" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "storeUrl" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "businessType" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "companyName" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "storeNotes" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "preferredContact" TEXT;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "availability" TEXT;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "priceRangeMin" DOUBLE PRECISION;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "priceRangeMax" DOUBLE PRECISION;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "preferredProjectTypes" TEXT;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "sallaExperience" TEXT;

'@

# Insert before the first -- CreateIndex (marks start of indexes section)
$idx = $ddl.IndexOf('-- CreateIndex')
if ($idx -ge 0) {
    $ddl = $ddl.Substring(0, $idx) + $missingColumns + $ddl.Substring($idx)
}

# === 4. Transform CREATE UNIQUE INDEX to CREATE UNIQUE INDEX IF NOT EXISTS ===
$ddl = $ddl -replace 'CREATE UNIQUE INDEX "', 'CREATE UNIQUE INDEX IF NOT EXISTS "'

# === 5. Transform CREATE INDEX to CREATE INDEX IF NOT EXISTS ===
$ddl = $ddl -replace 'CREATE INDEX "', 'CREATE INDEX IF NOT EXISTS "'

# === 6. Transform ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY to DO blocks ===
$ddl = [regex]::Replace($ddl, '(ALTER TABLE "[^"]+" ADD CONSTRAINT "([^"]+)" FOREIGN KEY \([^)]+\) REFERENCES "[^"]+"\("[^"]+"\)(?: ON DELETE (?:CASCADE|SET NULL|RESTRICT|NO ACTION|SET DEFAULT))?(?: ON UPDATE (?:CASCADE|SET NULL|RESTRICT|NO ACTION|SET DEFAULT))?);', {
    param($m)
    $stmt = $m.Groups[1].Value
    $constName = $m.Groups[2].Value
    "DO `$`$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '$constName') THEN $stmt; END IF; END`$`$;"
})

# === 7. Append new enum values for existing enums ===
$ddl += @"

-- New enum values for existing enums (safe on both shadow and production)
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'DELIVERY_SUBMITTED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'DELIVERY_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'DELIVERY_REVISION_REQUESTED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYOUT_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYOUT_HELD';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYOUT_PAID';
ALTER TYPE "ProjectStatus" ADD VALUE IF NOT EXISTS 'REVISION_REQUESTED';
"@

# Write output
$output = "prisma\migrations\20260611043448_profile_settings_and_payouts\migration.sql"
$ddl | Set-Content -LiteralPath $output -Encoding UTF8
Write-Host "Migration SQL written to $output"
Write-Host "File size: $((Get-Item $output).Length) bytes"

# Clean up BOM
$content = Get-Content -LiteralPath $output -Raw
[System.IO.File]::WriteAllText($output, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "BOM removed"
