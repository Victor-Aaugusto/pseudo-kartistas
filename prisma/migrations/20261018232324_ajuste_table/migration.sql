-- DropForeignKey
ALTER TABLE "Corridas" DROP CONSTRAINT "Corridas_campeonatoId_fkey";

-- AddForeignKey
ALTER TABLE "Corridas" ADD CONSTRAINT "Corridas_campeonatoId_fkey" FOREIGN KEY ("campeonatoId") REFERENCES "Campeonato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
