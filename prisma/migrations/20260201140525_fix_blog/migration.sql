/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "deletedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3);
