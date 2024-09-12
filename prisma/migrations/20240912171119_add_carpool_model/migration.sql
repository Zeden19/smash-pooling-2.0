-- CreateTable
CREATE TABLE `Carpool` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driverId` VARCHAR(191) NOT NULL,
    `originLat` INTEGER NOT NULL,
    `originLng` INTEGER NOT NULL,
    `originName` VARCHAR(191) NOT NULL,
    `desinationLat` INTEGER NOT NULL,
    `destinationLng` INTEGER NOT NULL,
    `destinationName` INTEGER NOT NULL,
    `tournamentSlug` VARCHAR(191) NOT NULL,
    `path` JSON NOT NULL,
    `price` INTEGER NOT NULL,
    `description` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CarpoolAttendee` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CarpoolAttendee_AB_unique`(`A`, `B`),
    INDEX `_CarpoolAttendee_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Carpool` ADD CONSTRAINT `Carpool_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarpoolAttendee` ADD CONSTRAINT `_CarpoolAttendee_A_fkey` FOREIGN KEY (`A`) REFERENCES `Carpool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarpoolAttendee` ADD CONSTRAINT `_CarpoolAttendee_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
