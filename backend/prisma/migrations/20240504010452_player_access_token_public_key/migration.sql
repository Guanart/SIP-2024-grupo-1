/*
  Warnings:

  - Added the required column `access_token` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_key` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "public_key" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
