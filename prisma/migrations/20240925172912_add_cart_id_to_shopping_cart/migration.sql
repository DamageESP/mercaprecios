/*
  Warnings:

  - A unique constraint covering the columns `[cartId]` on the table `ShoppingCart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartId` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_shoppingCartUuid_fkey";

-- AlterTable
ALTER TABLE "ShoppingCart" ADD COLUMN     "cartId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_cartId_key" ON "ShoppingCart"("cartId");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_shoppingCartUuid_fkey" FOREIGN KEY ("shoppingCartUuid") REFERENCES "ShoppingCart"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
