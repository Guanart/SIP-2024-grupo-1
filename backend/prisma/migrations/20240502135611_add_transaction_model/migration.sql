/*
  Warnings:

  - Added the required column `token_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "token_id" INTEGER NOT NULL;
