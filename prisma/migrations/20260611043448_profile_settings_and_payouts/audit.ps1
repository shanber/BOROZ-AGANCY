# Complete audit: orders table columns in schema vs migrations 1-5
$schemaCols = @(
    "id", "orderNumber", "userId", "orgId", "merchantId",
    "storeName", "managerName", "phone", "email", "sallaUrl",
    "serviceType", "serviceId", "budget", "priority", "description",
    "notes", "status", "adminNote", "internalNote", "selectedOfferId",
    "reviewedAt", "reviewedById", "source", "offersOpenedAt", "offersClosedAt",
    "createdAt", "updatedAt"
)

# Migrations 1-5 create orders table with these columns
# Migration 1: initial CREATE TABLE
$m1Cols = @("id","orderNumber","storeName","managerName","phone","email","sallaUrl","serviceType","budget","priority","description","notes","status","source","createdAt","updatedAt")
# Migration 2 adds: orgId, merchantId
$m2Cols = @("orgId","merchantId")
# Migration 3 adds: adminNote, internalNote, reviewedAt, reviewedById
$m3Cols = @("adminNote","internalNote","reviewedAt","reviewedById")
# Migration 4 adds: userId
$m4Cols = @("userId")
# Migration 5 adds: serviceId
$m5Cols = @("serviceId")

$migratedCols = $m1Cols + $m2Cols + $m3Cols + $m4Cols + $m5Cols | Sort-Object -Unique

Write-Host "=== Columns in Prisma Schema Order model ==="
$schemaCols | ForEach-Object { Write-Host "  $_" }

Write-Host "`n=== Columns created by migrations 1-5 ==="
$migratedCols | ForEach-Object { Write-Host "  $_" }

Write-Host "`n=== MISSING columns (in schema, NOT in migrations) ==="
$missing = $schemaCols | Where-Object { $_ -notin $migratedCols }
$missing | ForEach-Object { Write-Host "  << $_ >>" }

if ($missing.Count -eq 0) {
    Write-Host "  (none - all columns accounted for)"
}

Write-Host "`n=== EXTRA indexes (in schema, NOT in migrations) ==="
# Schema indexes
$schemaIndexes = @(
    "orders_orderNumber_key", "orders_userId_idx", "orders_orgId_idx",
    "orders_merchantId_idx", "orders_serviceId_idx", "orders_status_idx",
    "orders_selectedOfferId_key", "orders_selectedOfferId_idx",
    "orders_userId_createdAt_idx", "orders_status_createdAt_idx",
    "orders_serviceType_createdAt_idx"
)
$migrationIndexes = @(
    "orders_orderNumber_key",  # migration 1
    "orders_orgId_idx", "orders_merchantId_idx",  # migration 2
    "orders_status_idx",  # migration 3
    "orders_userId_createdAt_idx", "orders_status_createdAt_idx", "orders_serviceType_createdAt_idx",  # migration 4
    "orders_serviceId_idx"  # migration 5
)
$schemaIndexes | Where-Object { $_ -notin $migrationIndexes } | ForEach-Object { Write-Host "  << $_ >>" }

Write-Host "`n=== EXTRA FK constraints (in schema, NOT in migrations) ==="
$schemaFKs = @(
    "orders_userId_fkey", "orders_serviceId_fkey", "orders_selectedOfferId_fkey"
)
$migrationFKs = @()
$schemaFKs | Where-Object { $_ -notin $migrationFKs } | ForEach-Object { Write-Host "  << $_ >>" }

Write-Host "`nSummary:"
if ($missing.Count -gt 0) {
    Write-Host "Need to add $($missing.Count) missing columns: $($missing -join ', ')"
    Write-Host "All other tables are created fresh by CREATE TABLE IF NOT EXISTS"
}
