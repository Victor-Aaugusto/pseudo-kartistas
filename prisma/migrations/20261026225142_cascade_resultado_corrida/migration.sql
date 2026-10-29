-- DropForeignKey
ALTER TABLE "ResultadoCorrida" DROP CONSTRAINT "ResultadoCorrida_corridaId_fkey";

-- AddForeignKey
ALTER TABLE "ResultadoCorrida" ADD CONSTRAINT "ResultadoCorrida_corridaId_fkey" FOREIGN KEY ("corridaId") REFERENCES "Corridas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
