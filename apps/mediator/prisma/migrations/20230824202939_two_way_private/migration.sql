/*
  Warnings:

  - The values [TWO_WAY_PUBLIC] on the enum `CommunicationChannel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommunicationChannel_new" AS ENUM ('ONE_WAY_PUBLIC', 'TWO_WAY_PRIVATE', 'GROUP_PRIVATE');
ALTER TABLE "RegisteredIdentities" ALTER COLUMN "communicationChannels" TYPE "CommunicationChannel_new"[] USING ("communicationChannels"::text::"CommunicationChannel_new"[]);
ALTER TABLE "EventLog" ALTER COLUMN "communicationChannel" TYPE "CommunicationChannel_new" USING ("communicationChannel"::text::"CommunicationChannel_new");
ALTER TYPE "CommunicationChannel" RENAME TO "CommunicationChannel_old";
ALTER TYPE "CommunicationChannel_new" RENAME TO "CommunicationChannel";
DROP TYPE "CommunicationChannel_old";
COMMIT;
