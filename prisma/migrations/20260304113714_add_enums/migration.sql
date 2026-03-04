/*
  Warnings:

  - You are about to drop the column `change` on the `InventoryLog` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `InventoryLog` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `InventoryLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `InventoryLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryLog" DROP CONSTRAINT "InventoryLog_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_productId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userId_fkey";

-- AlterTable
ALTER TABLE "InventoryLog" DROP COLUMN "change",
DROP COLUMN "reason",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "type" "InventoryLogType" NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;
