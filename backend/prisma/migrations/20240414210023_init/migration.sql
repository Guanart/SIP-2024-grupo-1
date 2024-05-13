/*
  Warnings:

  - A unique constraint covering the columns `[auth0_id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_auth0_id_key" ON "Account"("auth0_id");
