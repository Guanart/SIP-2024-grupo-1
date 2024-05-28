/*
  Warnings:

  - You are about to drop the column `ranking` on the `Player` table. All the data in the column will be lost.
  - Added the required column `rank_id` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_ranking_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "ranking",
ADD COLUMN     "rank_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
