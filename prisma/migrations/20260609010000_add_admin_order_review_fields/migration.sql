ALTER TABLE "orders" ADD COLUMN "adminNote" TEXT;
ALTER TABLE "orders" ADD COLUMN "internalNote" TEXT;
ALTER TABLE "orders" ADD COLUMN "reviewedAt" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN "reviewedById" TEXT;

ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';

CREATE INDEX "orders_status_idx" ON "orders"("status");
