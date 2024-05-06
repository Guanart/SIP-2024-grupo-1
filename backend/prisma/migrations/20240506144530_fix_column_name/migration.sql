/*
  Warnings:

  - You are about to drop the column `token_price_percentage` on the `Collection` table. All the data in the column will be lost.
  - Added the required column `initial_token_prize_percentage` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_prize_percentage` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "token_price_percentage",
ADD COLUMN     "initial_token_prize_percentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "token_prize_percentage" DOUBLE PRECISION NOT NULL;
