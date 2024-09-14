-- CreateTable
CREATE TABLE "SearchHistory" (
    "userId" TEXT NOT NULL,
    "searchQuery" TEXT NOT NULL,
    "searchHistoryAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("userId","searchQuery")
);

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
