-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_organizationId_fkey";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
