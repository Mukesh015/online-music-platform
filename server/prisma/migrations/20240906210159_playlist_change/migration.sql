/*
  Warnings:

  - You are about to drop the column `id` on the `Playlist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_id_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "id";

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
