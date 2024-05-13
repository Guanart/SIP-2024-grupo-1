/*
  Warnings:

  - You are about to drop the column `cbu` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `paypal_id` on the `Wallet` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Wallet_cbu_key";

-- DropIndex
DROP INDEX "Wallet_paypal_id_key";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "cbu",
DROP COLUMN "paypal_id";
