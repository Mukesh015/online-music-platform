-- CreateTable
CREATE TABLE "Playlist" (
    "userId" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "playlistName" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("userId","playlistId")
);

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_id_fkey" FOREIGN KEY ("id") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
