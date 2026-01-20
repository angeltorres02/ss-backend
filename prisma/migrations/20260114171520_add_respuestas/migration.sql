/*
  Warnings:

  - Added the required column `respuestas` to the `Formulario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formulario" ADD COLUMN     "respuestas" JSONB NOT NULL;
