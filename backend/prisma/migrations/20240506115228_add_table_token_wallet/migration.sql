-- CreateTable
CREATE TABLE "Token_Wallet" (
    "token_id" INTEGER NOT NULL,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "Token_Wallet_pkey" PRIMARY KEY ("wallet_id","token_id")
);

-- AddForeignKey
ALTER TABLE "Token_Wallet" ADD CONSTRAINT "Token_Wallet_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token_Wallet" ADD CONSTRAINT "Token_Wallet_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
