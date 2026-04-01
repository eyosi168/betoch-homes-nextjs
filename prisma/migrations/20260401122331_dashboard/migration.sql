-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL DEFAULT 'system-settings',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "autoApprovePosts" BOOLEAN NOT NULL DEFAULT false,
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "supportEmail" TEXT NOT NULL DEFAULT 'support@betochhomes.com',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);
