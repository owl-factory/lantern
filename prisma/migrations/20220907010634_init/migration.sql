-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "displayName" VARCHAR(64),
    "avatarSrc" TEXT,
    "storageUsed" BIGINT NOT NULL DEFAULT 0,
    "maximumStorage" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSecret" (
    "id" UUID NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "userID" UUID NOT NULL,

    CONSTRAINT "UserSecret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_username_key" ON "UserSecret"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_email_key" ON "UserSecret"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_userID_key" ON "UserSecret"("userID");

-- AddForeignKey
ALTER TABLE "UserSecret" ADD CONSTRAINT "UserSecret_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
