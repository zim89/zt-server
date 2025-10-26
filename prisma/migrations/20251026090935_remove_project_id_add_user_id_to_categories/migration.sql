/*
  Warnings:

  - You are about to drop the column `projectId` on the `categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_projectId_fkey";

-- DropIndex
DROP INDEX "public"."categories_slug_key";

-- DropIndex
DROP INDEX "public"."markers_slug_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "projectId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_slug_key" ON "categories"("userId", "slug");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
