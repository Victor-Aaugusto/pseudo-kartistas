-- CreateTable
CREATE TABLE "ResultadoCorrida" (
    "corridaId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "posicao" INTEGER NOT NULL,
    "pontuacao" INTEGER NOT NULL,

    CONSTRAINT "ResultadoCorrida_pkey" PRIMARY KEY ("corridaId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResultadoCorrida_corridaId_userId_key" ON "ResultadoCorrida"("corridaId", "userId");

-- AddForeignKey
ALTER TABLE "ResultadoCorrida" ADD CONSTRAINT "ResultadoCorrida_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoCorrida" ADD CONSTRAINT "ResultadoCorrida_corridaId_fkey" FOREIGN KEY ("corridaId") REFERENCES "Corridas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
