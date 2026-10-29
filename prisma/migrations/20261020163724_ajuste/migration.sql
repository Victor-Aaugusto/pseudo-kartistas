/*
  Warnings:

  - A unique constraint covering the columns `[corridaId,userId,posicao]` on the table `ResultadoCorrida` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ResultadoCorrida_corridaId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ResultadoCorrida_corridaId_userId_posicao_key" ON "ResultadoCorrida"("corridaId", "userId", "posicao");
