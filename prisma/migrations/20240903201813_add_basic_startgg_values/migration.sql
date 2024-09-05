/*
  Warnings:

  - A unique constraint covering the columns `[startggId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `startggId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersame` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `startggId` INTEGER NOT NULL,
    ADD COLUMN `usersame` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_startggId_key` ON `User`(`startggId`);
