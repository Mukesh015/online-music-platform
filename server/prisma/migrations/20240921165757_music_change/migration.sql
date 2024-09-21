-- AddForeignKey
ALTER TABLE "lasthistory" ADD CONSTRAINT "lasthistory_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;
