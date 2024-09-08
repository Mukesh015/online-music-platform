-- CreateTable
CREATE TABLE "lasthistory" (
    "userId" TEXT NOT NULL,
    "musicId" INTEGER NOT NULL,
    "musicUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "musicTitle" TEXT NOT NULL,
    "musicArtist" TEXT NOT NULL,
    "lastPlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lasthistory_pkey" PRIMARY KEY ("userId","musicId")
);

-- AddForeignKey
ALTER TABLE "lasthistory" ADD CONSTRAINT "lasthistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
