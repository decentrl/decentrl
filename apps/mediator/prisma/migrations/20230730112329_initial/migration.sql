-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('ONE_WAY_PUBLIC', 'TWO_WAY_PUBLIC', 'GROUP_PRIVATE');

-- CreateTable
CREATE TABLE "RegisteredIdentities" (
    "did" TEXT NOT NULL,
    "communicationChannels" "CommunicationChannel"[],

    CONSTRAINT "RegisteredIdentities_pkey" PRIMARY KEY ("did")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisteredIdentities_did_key" ON "RegisteredIdentities"("did");
