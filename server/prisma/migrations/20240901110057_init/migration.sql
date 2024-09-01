-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Music" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "musicUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "musicTitle" TEXT NOT NULL,
    "musicArtist" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IsFavourite" (
    "userId" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "isFavourite" BOOLEAN NOT NULL,

    CONSTRAINT "IsFavourite_pkey" PRIMARY KEY ("userId","id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Music_userId_musicUrl_key" ON "Music"("userId", "musicUrl");

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IsFavourite" ADD CONSTRAINT "IsFavourite_id_fkey" FOREIGN KEY ("id") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
