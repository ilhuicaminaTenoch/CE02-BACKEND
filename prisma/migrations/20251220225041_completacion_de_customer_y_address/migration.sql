/*
  Warnings:

  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `NoExt` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noInt` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settlement` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactMethod` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('WHATSAPP', 'CALL', 'EMAIL');

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "NoExt" TEXT NOT NULL,
ADD COLUMN     "noInt" TEXT NOT NULL,
ADD COLUMN     "references" TEXT,
ADD COLUMN     "settlement" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "contactMethod" "ContactMethod" NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- DropTable
DROP TABLE "products";

-- DropEnum
DROP TYPE "ProductCategory";
