-- CreateEnum
CREATE TYPE "SocialProviders" AS ENUM ('FACEBOOK', 'GOOGLE', 'APPLE', 'GITHUB', 'GITLAB');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "taxId" TEXT,
    "companyId" TEXT,
    "phoneNumber" TEXT,
    "city" TEXT,
    "street" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "dateJoined" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    "isFirstPasswordSet" BOOLEAN DEFAULT false,
    "isEmailSet" BOOLEAN DEFAULT false,
    "isEmailVerified" BOOLEAN DEFAULT false,
    "authority" TEXT,
    "phoneNumber" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileMetadata" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "ProfileMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provider" "SocialProviders" NOT NULL DEFAULT E'GOOGLE',
    "providerUserId" TEXT NOT NULL,
    "providerResponse" JSONB NOT NULL DEFAULT '{}',
    "profileId" TEXT NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionData" JSONB NOT NULL DEFAULT '{}',
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkInformation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionsId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT E'-',
    "countryCode" TEXT NOT NULL DEFAULT E'-',
    "city" TEXT NOT NULL DEFAULT E'-',
    "state" TEXT NOT NULL DEFAULT E'-',
    "tzOffset" TEXT NOT NULL DEFAULT E'00:00',
    "parsedInformation" JSONB NOT NULL DEFAULT '{}',
    "profileId" TEXT NOT NULL,

    CONSTRAINT "NetworkInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileMetadata_profileId_key" ON "ProfileMetadata"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_providerUserId_provider_key" ON "SocialAccount"("providerUserId", "provider");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMetadata" ADD CONSTRAINT "ProfileMetadata_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkInformation" ADD CONSTRAINT "NetworkInformation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkInformation" ADD CONSTRAINT "NetworkInformation_sessionsId_fkey" FOREIGN KEY ("sessionsId") REFERENCES "Sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
