/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Formulario` table. All the data in the column will be lost.
  - You are about to drop the column `respuestas` on the `Formulario` table. All the data in the column will be lost.
  - Added the required column `idForm` to the `Formulario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formulario" DROP COLUMN "createdAt",
DROP COLUMN "respuestas",
ADD COLUMN     "idForm" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Norton" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "preguntaUno" TEXT NOT NULL,
    "preguntaDos" TEXT NOT NULL,
    "preguntaTres" TEXT NOT NULL,
    "preguntaCuatro" TEXT NOT NULL,
    "preguntaCinco" TEXT NOT NULL,
    "preguntaSeis" TEXT NOT NULL,
    "preguntaSiete" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Norton_pkey" PRIMARY KEY ("id")
);
