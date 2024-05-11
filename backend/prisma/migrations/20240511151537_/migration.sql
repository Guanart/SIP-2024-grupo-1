-- CreateTable
CREATE TABLE "Marketplace_publication" (
    "publication_id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "out_wallet" INTEGER NOT NULL,

    CONSTRAINT "Marketplace_publication_pkey" PRIMARY KEY ("publication_id")
);

-- CreateTable
CREATE TABLE "In_wallet" (
    "publication_id" INTEGER NOT NULL,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "In_wallet_pkey" PRIMARY KEY ("publication_id")
);

-- CreateTable
CREATE TABLE "Publication_token" (
    "publication_id" INTEGER NOT NULL,
    "token_id" INTEGER NOT NULL,

    CONSTRAINT "Publication_token_pkey" PRIMARY KEY ("publication_id")
);

-- AddForeignKey
ALTER TABLE "Marketplace_publication" ADD CONSTRAINT "Marketplace_publication_out_wallet_fkey" FOREIGN KEY ("out_wallet") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "In_wallet" ADD CONSTRAINT "In_wallet_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "Marketplace_publication"("publication_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "In_wallet" ADD CONSTRAINT "In_wallet_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication_token" ADD CONSTRAINT "Publication_token_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "Marketplace_publication"("publication_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication_token" ADD CONSTRAINT "Publication_token_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
