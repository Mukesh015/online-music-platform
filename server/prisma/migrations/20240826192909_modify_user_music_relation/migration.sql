/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `Music` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Music_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Music_userId_url_key" ON "Music"("userId", "url");
