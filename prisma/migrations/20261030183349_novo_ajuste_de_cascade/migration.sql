-- DropForeignKey
ALTER TABLE "ResultadoCorrida" DROP CONSTRAINT "ResultadoCorrida_userId_fkey";

-- AddForeignKey
ALTER TABLE "ResultadoCorrida" ADD CONSTRAINT "ResultadoCorrida_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
