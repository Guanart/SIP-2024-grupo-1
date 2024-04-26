/*
  Warnings:

  - You are about to drop the column `max_player` on the `Event` table. All the data in the column will be lost.
  - Added the required column `max_players` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "max_player",
ADD COLUMN     "max_players" INTEGER NOT NULL;
