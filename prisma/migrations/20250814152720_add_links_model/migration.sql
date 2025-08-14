/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Link" DROP COLUMN "expirationDate",
ADD COLUMN     "expiresAt" TIMESTAMP(3);
