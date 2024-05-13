/*
  Warnings:

  - You are about to drop the column `initial_price` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `initial_token_prize_percentage` on the `Collection` table. All the data in the column will be lost.
  - Added the required column `previous_price` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous_token_prize_percentage` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "initial_price",
DROP COLUMN "initial_token_prize_percentage",
ADD COLUMN     "previous_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "previous_token_prize_percentage" DOUBLE PRECISION NOT NULL;
