/*
  Warnings:

  - You are about to drop the column `access_token` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `public_key` on the `Wallet` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Wallet_access_token_key";

-- DropIndex
DROP INDEX "Wallet_public_key_key";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "access_token",
DROP COLUMN "public_key";
