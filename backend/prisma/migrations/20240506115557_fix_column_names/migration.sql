/*
  Warnings:

  - You are about to drop the `Token_Wallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token_Wallet" DROP CONSTRAINT "Token_Wallet_token_id_fkey";

-- DropForeignKey
ALTER TABLE "Token_Wallet" DROP CONSTRAINT "Token_Wallet_wallet_id_fkey";

-- DropTable
DROP TABLE "Token_Wallet";

-- CreateTable
CREATE TABLE "Token_wallet" (
    "token_id" INTEGER NOT NULL,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "Token_wallet_pkey" PRIMARY KEY ("wallet_id","token_id")
);

-- AddForeignKey
ALTER TABLE "Token_wallet" ADD CONSTRAINT "Token_wallet_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token_wallet" ADD CONSTRAINT "Token_wallet_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
