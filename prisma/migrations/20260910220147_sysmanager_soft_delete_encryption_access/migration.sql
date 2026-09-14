-- AlterTable
ALTER TABLE `Asset` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Branch` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Credential` ADD COLUMN `accessMode` VARCHAR(191) NOT NULL DEFAULT 'copy_open',
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `url` VARCHAR(191) NULL,
    MODIFY `username` TEXT NOT NULL,
    MODIFY `password` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Employee` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Maintenance` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Task` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Ticket` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Asset_deletedAt_idx` ON `Asset`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Branch_deletedAt_idx` ON `Branch`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Credential_deletedAt_idx` ON `Credential`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Employee_deletedAt_idx` ON `Employee`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Invoice_deletedAt_idx` ON `Invoice`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Maintenance_deletedAt_idx` ON `Maintenance`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Task_deletedAt_idx` ON `Task`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Ticket_deletedAt_idx` ON `Ticket`(`deletedAt`);
