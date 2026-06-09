-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "managerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "sallaUrl" TEXT,
    "serviceType" TEXT NOT NULL,
    "budget" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'عادي',
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'جديد',
    "source" TEXT NOT NULL DEFAULT 'website',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");
