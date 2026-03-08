-- CreateTable
CREATE TABLE "ImagePool" (
    "id" SERIAL NOT NULL,
    "base64" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImagePool_pkey" PRIMARY KEY ("id")
);
