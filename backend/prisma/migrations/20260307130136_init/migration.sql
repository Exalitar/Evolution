-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegramId" TEXT NOT NULL,
    "username" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "ep" INTEGER NOT NULL DEFAULT 0,
    "evolutionStage" INTEGER NOT NULL DEFAULT 1,
    "totalSynthesisCount" INTEGER NOT NULL DEFAULT 0,
    "usedMaterials" TEXT[],
    "currentMaterialPool" JSONB,
    "equipmentData" JSONB,
    "bioImage" TEXT,
    "lastGeneratedLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "strikePower" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "bioResource" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "defKinetic" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "defEnergy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "defBio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "defToxic" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "defPsionic" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "defTech" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blockChance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blockMitigation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "critChance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "critMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "lifestealPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lifestealChance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dotDamage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dotChance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stunChance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stunDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stunCooldown" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Stats_userId_key" ON "Stats"("userId");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
