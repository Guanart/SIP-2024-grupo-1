/*
  Warnings:

  - You are about to drop the column `share_per_unit` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `prize_share` on the `Fundraising` table. All the data in the column will be lost.
  - Added the required column `current_price` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_price_percentage` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prize_percentage` to the `Fundraising` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "share_per_unit",
ADD COLUMN     "current_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "token_price_percentage" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Fundraising" DROP COLUMN "prize_share",
ADD COLUMN     "prize_percentage" DOUBLE PRECISION NOT NULL;
