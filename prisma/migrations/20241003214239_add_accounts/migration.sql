-- AlterTable
ALTER TABLE "ShoppingCart" ADD COLUMN     "userEmail" TEXT;

-- CreateTable
CREATE TABLE "LoginLinks" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginLinks_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoginLinks_email_key" ON "LoginLinks"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LoginLinks_token_key" ON "LoginLinks"("token");
