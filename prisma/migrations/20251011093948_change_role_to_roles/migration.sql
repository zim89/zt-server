/*
  Warnings:

  - You are about to drop the column `role` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "role",
ADD COLUMN     "roles" "ProjectRole"[] DEFAULT ARRAY['MEMBER']::"ProjectRole"[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "roles" "UserRole"[] DEFAULT ARRAY['OWNER']::"UserRole"[];
