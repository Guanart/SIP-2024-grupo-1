/*
  Warnings:

  - The primary key for the `In_wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Marketplace_publication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `out_wallet` on the `Marketplace_publication` table. All the data in the column will be lost.
  - You are about to drop the column `publication_id` on the `Marketplace_publication` table. All the data in the column will be lost.
  - You are about to drop the `Publication_token` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[publication_id]` on the table `In_wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `out_wallet_id` to the `Marketplace_publication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_id` to the `Marketplace_publication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "In_wallet" DROP CONSTRAINT "In_wallet_publication_id_fkey";

-- DropForeignKey
ALTER TABLE "Marketplace_publication" DROP CONSTRAINT "Marketplace_publication_out_wallet_fkey";

-- DropForeignKey
ALTER TABLE "Publication_token" DROP CONSTRAINT "Publication_token_publication_id_fkey";

-- DropForeignKey
ALTER TABLE "Publication_token" DROP CONSTRAINT "Publication_token_token_id_fkey";

-- AlterTable
ALTER TABLE "In_wallet" DROP CONSTRAINT "In_wallet_pkey",
ADD CONSTRAINT "In_wallet_pkey" PRIMARY KEY ("wallet_id", "publication_id");

-- AlterTable
ALTER TABLE "Marketplace_publication" DROP CONSTRAINT "Marketplace_publication_pkey",
DROP COLUMN "out_wallet",
DROP COLUMN "publication_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "out_wallet_id" INTEGER NOT NULL,
ADD COLUMN     "token_id" INTEGER NOT NULL,
ADD CONSTRAINT "Marketplace_publication_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Publication_token";

-- CreateIndex
CREATE UNIQUE INDEX "In_wallet_publication_id_key" ON "In_wallet"("publication_id");

-- AddForeignKey
ALTER TABLE "Marketplace_publication" ADD CONSTRAINT "Marketplace_publication_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marketplace_publication" ADD CONSTRAINT "Marketplace_publication_out_wallet_id_fkey" FOREIGN KEY ("out_wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "In_wallet" ADD CONSTRAINT "In_wallet_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "Marketplace_publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
