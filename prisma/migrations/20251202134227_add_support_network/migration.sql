/*
  Warnings:

  - A unique constraint covering the columns `[shareCode]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PREGNANT', 'SUPPORT_NETWORK');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "shareCode" TEXT,
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'PREGNANT';

-- CreateTable
CREATE TABLE "support_network" (
    "id" TEXT NOT NULL,
    "pregnantId" TEXT NOT NULL,
    "supportId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "status" "SupportStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_network_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "support_network_supportId_key" ON "support_network"("supportId");

-- CreateIndex
CREATE UNIQUE INDEX "users_shareCode_key" ON "users"("shareCode");

-- AddForeignKey
ALTER TABLE "support_network" ADD CONSTRAINT "support_network_pregnantId_fkey" FOREIGN KEY ("pregnantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_network" ADD CONSTRAINT "support_network_supportId_fkey" FOREIGN KEY ("supportId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
