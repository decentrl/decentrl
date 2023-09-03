/*
  Warnings:

  - You are about to drop the `RegisteredIdentities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RegisteredIdentities";

-- CreateTable
CREATE TABLE "CommunicationContract" (
    "id" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "partyOne" TEXT NOT NULL,
    "partyTwo" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "communicationChannels" "CommunicationChannel"[] DEFAULT ARRAY[]::"CommunicationChannel"[],

    CONSTRAINT "CommunicationContract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunicationContract_partyOne_idx" ON "CommunicationContract"("partyOne");

-- CreateIndex
CREATE INDEX "CommunicationContract_partyTwo_idx" ON "CommunicationContract"("partyTwo");
