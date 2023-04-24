/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `branch` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "branch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "ProductMovement" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "depositId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "typeDescription" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductMovement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductMovement" ADD CONSTRAINT "ProductMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMovement" ADD CONSTRAINT "ProductMovement_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
