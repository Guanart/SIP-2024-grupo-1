/*
  Warnings:

  - You are about to drop the column `game` on the `Game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Game_game_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "game",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");
