-- DropForeignKey
ALTER TABLE "Campeonato" DROP CONSTRAINT "Campeonato_userId_fkey";

-- AddForeignKey
ALTER TABLE "Campeonato" ADD CONSTRAINT "Campeonato_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
