/*
  Warnings:

  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("userId", "musicId", "playlistName");
