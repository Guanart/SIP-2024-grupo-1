-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_ranking_fkey" FOREIGN KEY ("ranking") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
