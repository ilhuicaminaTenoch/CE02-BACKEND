/*
  Warnings:

  - You are about to drop the column `orderId` on the `appointments` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AppointmentMode" AS ENUM ('REMOTE', 'IN_PERSON');

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_orderId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "orderId",
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "mode" "AppointmentMode" NOT NULL DEFAULT 'IN_PERSON';
