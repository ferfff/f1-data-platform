-- CreateTable
CREATE TABLE "Endpoint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Endpoint_pkey" PRIMARY KEY ("id")
);
