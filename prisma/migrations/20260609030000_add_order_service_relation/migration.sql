-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "serviceId" TEXT;

-- CreateIndex
CREATE INDEX "orders_serviceId_idx" ON "orders"("serviceId");
