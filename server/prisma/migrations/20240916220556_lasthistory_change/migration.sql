/*
  Warnings:

  - The primary key for the `lasthistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId]` on the table `lasthistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "lasthistory" DROP CONSTRAINT "lasthistory_pkey",
ADD CONSTRAINT "lasthistory_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "lasthistory_userId_key" ON "lasthistory"("userId");
