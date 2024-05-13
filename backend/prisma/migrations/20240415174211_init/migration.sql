/*
  Warnings:

  - A unique constraint covering the columns `[account_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_account_id_key" ON "User"("account_id");
