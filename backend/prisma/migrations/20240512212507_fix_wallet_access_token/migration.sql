/*
  Warnings:

  - A unique constraint covering the columns `[access_token]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_key]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "paypal_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_access_token_key" ON "Wallet"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_public_key_key" ON "Wallet"("public_key");
