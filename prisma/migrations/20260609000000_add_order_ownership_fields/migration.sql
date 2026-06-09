ALTER TABLE "orders" ADD COLUMN "orgId" TEXT;
ALTER TABLE "orders" ADD COLUMN "merchantId" TEXT;

CREATE INDEX "orders_orgId_idx" ON "orders"("orgId");
CREATE INDEX "orders_merchantId_idx" ON "orders"("merchantId");
