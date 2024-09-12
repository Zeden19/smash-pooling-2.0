/*
  Warnings:

  - You are about to drop the column `desinationLat` on the `Carpool` table. All the data in the column will be lost.
  - Added the required column `destinationLat` to the `Carpool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Carpool` DROP COLUMN `desinationLat`,
    ADD COLUMN `destinationLat` INTEGER NOT NULL;
