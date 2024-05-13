/*
  Warnings:

  - A unique constraint covering the columns `[fundraising_id]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Collection_fundraising_id_key" ON "Collection"("fundraising_id");
