-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "displayName" VARCHAR(64),
    "avatarSrc" TEXT,
    "storageUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSecret" (
    "id" UUID NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "hashedPassword" BYTEA NOT NULL,
    "salt" BYTEA NOT NULL,
    "userID" UUID NOT NULL,

    CONSTRAINT "UserSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "rulesetID" UUID NOT NULL,
    "bannerID" UUID,
    "bannerSrc" TEXT,
    "lastPlayedAt" TIMESTAMP(3) NOT NULL,
    "playtime" INTEGER NOT NULL,
    "ownedBy" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignModule" (
    "campaignID" UUID NOT NULL,
    "moduleID" UUID NOT NULL,
    "sourceUserID" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "CampaignAccess" (
    "userID" UUID NOT NULL,
    "campaignID" UUID NOT NULL,
    "access" VARCHAR(32) NOT NULL DEFAULT 'player'
);

-- CreateTable
CREATE TABLE "CampaignAccessLink" (
    "id" UUID NOT NULL,
    "campaignID" UUID NOT NULL,
    "linkKey" VARCHAR(32) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "access" VARCHAR(32) NOT NULL DEFAULT 'player',
    "uses" INTEGER NOT NULL DEFAULT 0,
    "maximumUses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CampaignAccessLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruleset" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "alias" VARCHAR(64),
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "actorFields" JSONB NOT NULL DEFAULT '{}',
    "rules" JSONB NOT NULL DEFAULT '{}',
    "ownedBy" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "alias" VARCHAR(64),
    "rulesetID" UUID NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishAccess" VARCHAR(32) NOT NULL DEFAULT 'aware',
    "ownedBy" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAccess" (
    "userID" UUID NOT NULL,
    "moduleID" UUID NOT NULL,
    "access" VARCHAR(32) NOT NULL DEFAULT 'aware'
);

-- CreateTable
CREATE TABLE "ContentType" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "alias" VARCHAR(32),
    "icon" VARCHAR(32) NOT NULL,
    "rulesetID" UUID NOT NULL,
    "contentFields" JSONB NOT NULL DEFAULT '{}',
    "viewLayout" XML NOT NULL DEFAULT '',
    "viewStyling" TEXT NOT NULL DEFAULT '',
    "searchLayout" XML NOT NULL DEFAULT '',
    "resultLayout" XML NOT NULL DEFAULT '',
    "searchStyling" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "ContentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "alias" VARCHAR(32),
    "rulesetID" UUID NOT NULL,
    "contentTypeID" UUID NOT NULL,
    "moduleID" UUID,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "fields" JSONB NOT NULL DEFAULT '{}',
    "ownedBy" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentRelation" (
    "parentID" UUID NOT NULL,
    "childID" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "ContentAccess" (
    "userID" UUID NOT NULL,
    "contentID" UUID NOT NULL,
    "access" VARCHAR(32) NOT NULL DEFAULT 'aware'
);

-- CreateTable
CREATE TABLE "ActorType" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "baseActorType" VARCHAR(32) NOT NULL,
    "rulesetID" UUID NOT NULL,
    "defaultActorSheetID" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "ActorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "rulesetID" UUID NOT NULL,
    "actorTypeID" UUID NOT NULL,
    "actorSheetID" UUID NOT NULL,
    "campaignID" UUID,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publicAccess" VARCHAR(32) NOT NULL DEFAULT 'aware',
    "fields" JSONB NOT NULL DEFAULT '{}',
    "content" JSONB NOT NULL DEFAULT '{}',
    "ownedBy" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActorSheet" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "rulesetID" UUID NOT NULL,
    "layout" XML NOT NULL,
    "styling" TEXT NOT NULL,
    "ownedBy" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "ActorSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "src" TEXT NOT NULL,
    "mimetype" VARCHAR(32) NOT NULL,
    "assetType" VARCHAR(32) NOT NULL,
    "sizeInBytes" INTEGER NOT NULL DEFAULT 0,
    "s3Key" TEXT NOT NULL,
    "s3Path" TEXT NOT NULL,
    "isS3Pending" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL DEFAULT '{}',
    "ownedBy" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "campaignID" UUID,
    "config" JSONB NOT NULL DEFAULT '{}',
    "actors" JSONB NOT NULL DEFAULT '{}',
    "assets" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Scene_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_username_key" ON "UserSecret"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_email_key" ON "UserSecret"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_userID_key" ON "UserSecret"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignModule_campaignID_key" ON "CampaignModule"("campaignID");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignModule_moduleID_key" ON "CampaignModule"("moduleID");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignModule_sourceUserID_key" ON "CampaignModule"("sourceUserID");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignAccess_userID_key" ON "CampaignAccess"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignAccess_campaignID_key" ON "CampaignAccess"("campaignID");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAccess_userID_key" ON "ModuleAccess"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAccess_moduleID_key" ON "ModuleAccess"("moduleID");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRelation_parentID_key" ON "ContentRelation"("parentID");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRelation_childID_key" ON "ContentRelation"("childID");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAccess_userID_key" ON "ContentAccess"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAccess_contentID_key" ON "ContentAccess"("contentID");

-- AddForeignKey
ALTER TABLE "UserSecret" ADD CONSTRAINT "UserSecret_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_rulesetID_fkey" FOREIGN KEY ("rulesetID") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_bannerID_fkey" FOREIGN KEY ("bannerID") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignModule" ADD CONSTRAINT "CampaignModule_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignModule" ADD CONSTRAINT "CampaignModule_moduleID_fkey" FOREIGN KEY ("moduleID") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignAccessLink" ADD CONSTRAINT "CampaignAccessLink_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_rulesetID_fkey" FOREIGN KEY ("rulesetID") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_moduleID_fkey" FOREIGN KEY ("moduleID") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentType" ADD CONSTRAINT "ContentType_rulesetID_fkey" FOREIGN KEY ("rulesetID") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentType" ADD CONSTRAINT "ContentType_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentType" ADD CONSTRAINT "ContentType_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentType" ADD CONSTRAINT "ContentType_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_rulesetID_fkey" FOREIGN KEY ("rulesetID") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_contentTypeID_fkey" FOREIGN KEY ("contentTypeID") REFERENCES "ContentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_moduleID_fkey" FOREIGN KEY ("moduleID") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRelation" ADD CONSTRAINT "ContentRelation_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRelation" ADD CONSTRAINT "ContentRelation_childID_fkey" FOREIGN KEY ("childID") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAccess" ADD CONSTRAINT "ContentAccess_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAccess" ADD CONSTRAINT "ContentAccess_contentID_fkey" FOREIGN KEY ("contentID") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorType" ADD CONSTRAINT "ActorType_rulesetID_fkey" FOREIGN KEY ("rulesetID") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorType" ADD CONSTRAINT "ActorType_defaultActorSheetID_fkey" FOREIGN KEY ("defaultActorSheetID") REFERENCES "ActorSheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorType" ADD CONSTRAINT "ActorType_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorType" ADD CONSTRAINT "ActorType_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorType" ADD CONSTRAINT "ActorType_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_rulesetID_fkey" FOREIGN KEY ("rulesetID") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_actorTypeID_fkey" FOREIGN KEY ("actorTypeID") REFERENCES "ActorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_actorSheetID_fkey" FOREIGN KEY ("actorSheetID") REFERENCES "ActorSheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorSheet" ADD CONSTRAINT "ActorSheet_rulesetID_fkey" FOREIGN KEY ("rulesetID") REFERENCES "Ruleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorSheet" ADD CONSTRAINT "ActorSheet_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorSheet" ADD CONSTRAINT "ActorSheet_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorSheet" ADD CONSTRAINT "ActorSheet_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorSheet" ADD CONSTRAINT "ActorSheet_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scene" ADD CONSTRAINT "Scene_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
