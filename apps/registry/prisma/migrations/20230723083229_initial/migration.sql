/*
  Warnings:

  - Added the required column `signature` to the `DidDocument` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `didDocument` on the `DidDocument` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DidDocument" ADD COLUMN     "signature" TEXT NOT NULL,
DROP COLUMN "didDocument",
ADD COLUMN     "didDocument" JSONB NOT NULL;
