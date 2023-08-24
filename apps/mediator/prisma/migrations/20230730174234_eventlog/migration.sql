-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "receiver" TEXT,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);
