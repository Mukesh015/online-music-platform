-- DropForeignKey
ALTER TABLE "IsFavourite" DROP CONSTRAINT "IsFavourite_id_fkey";

-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_userId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_musicId_fkey";

-- DropForeignKey
ALTER TABLE "lasthistory" DROP CONSTRAINT "lasthistory_userId_fkey";

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IsFavourite" ADD CONSTRAINT "IsFavourite_id_fkey" FOREIGN KEY ("id") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lasthistory" ADD CONSTRAINT "lasthistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
