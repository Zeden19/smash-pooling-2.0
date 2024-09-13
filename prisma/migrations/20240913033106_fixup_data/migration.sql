/*
  Warnings:

  - You are about to drop the column `path` on the `Carpool` table. All the data in the column will be lost.
  - Added the required column `route` to the `Carpool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Carpool` DROP COLUMN `path`,
    ADD COLUMN `route` JSON NOT NULL,
    MODIFY `price` INTEGER NOT NULL DEFAULT 0,
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';
