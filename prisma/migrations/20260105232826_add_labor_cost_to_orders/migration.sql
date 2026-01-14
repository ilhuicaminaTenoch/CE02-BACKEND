/*
  Warnings:

  - You are about to drop the column `subtotal` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "subtotal",
DROP COLUMN "total",
ADD COLUMN     "labor_cost" DOUBLE PRECISION;
