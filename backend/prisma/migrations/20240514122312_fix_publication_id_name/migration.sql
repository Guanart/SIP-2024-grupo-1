/*
  Warnings:

  - The primary key for the `Marketplace_publication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Marketplace_publication` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "In_wallet" DROP CONSTRAINT "In_wallet_publication_id_fkey";

-- AlterTable
ALTER TABLE "Marketplace_publication" DROP CONSTRAINT "Marketplace_publication_pkey",
DROP COLUMN "id",
ADD COLUMN     "publication_id" SERIAL NOT NULL,
ADD CONSTRAINT "Marketplace_publication_pkey" PRIMARY KEY ("publication_id");

-- AddForeignKey
ALTER TABLE "In_wallet" ADD CONSTRAINT "In_wallet_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "Marketplace_publication"("publication_id") ON DELETE RESTRICT ON UPDATE CASCADE;
