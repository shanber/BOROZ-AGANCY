-- Add the userId column that exists in the Prisma schema but was not migrated
ALTER TABLE "orders" ADD COLUMN "userId" TEXT;

CREATE INDEX "orders_userId_createdAt_idx" ON "orders"("userId", "createdAt");
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");
CREATE INDEX "orders_serviceType_createdAt_idx" ON "orders"("serviceType", "createdAt");
