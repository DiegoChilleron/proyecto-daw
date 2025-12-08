/*
  Warnings:

  - You are about to drop the column `size` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sizes` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subdomain]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `siteConfig` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateType` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('corporate', 'portfolio', 'landing', 'blog', 'ecommerce');

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('pending', 'building', 'deploying', 'deployed', 'failed');

-- DropIndex
DROP INDEX "Product_gender_idx";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "size",
ADD COLUMN     "deployedAt" TIMESTAMP(3),
ADD COLUMN     "deploymentStatus" "DeploymentStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "deploymentUrl" TEXT,
ADD COLUMN     "siteConfig" JSONB NOT NULL,
ADD COLUMN     "subdomain" TEXT,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "gender",
DROP COLUMN "inStock",
DROP COLUMN "sizes",
ADD COLUMN     "demoUrl" TEXT,
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "formFields" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "templateType" "TemplateType" NOT NULL;

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "Size";

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_subdomain_key" ON "OrderItem"("subdomain");

-- CreateIndex
CREATE INDEX "Product_templateType_idx" ON "Product"("templateType");
