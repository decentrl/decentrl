-- CreateTable
CREATE TABLE "DidDocument" (
    "did" TEXT NOT NULL,
    "didDocument" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DidDocument_pkey" PRIMARY KEY ("did")
);

-- CreateIndex
CREATE UNIQUE INDEX "DidDocument_did_key" ON "DidDocument"("did");
