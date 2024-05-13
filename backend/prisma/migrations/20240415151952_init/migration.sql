/*
  Warnings:

  - Added the required column `avatar` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_account_id_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "avatar" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;
