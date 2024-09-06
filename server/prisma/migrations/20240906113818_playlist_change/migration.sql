/*
  Warnings:

  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `musicId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
ADD COLUMN     "musicId" INTEGER NOT NULL,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("userId", "musicId");
