-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cbu" TEXT NOT NULL,
    "paypal_id" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_id_key" ON "Wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_cbu_key" ON "Wallet"("cbu");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_paypal_id_key" ON "Wallet"("paypal_id");
