-- CreateTable
CREATE TABLE "Formulario" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "respuestas" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);
