-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: coremanager
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Asset`
--

DROP TABLE IF EXISTS `Asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Asset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serial` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchaseDate` datetime(3) DEFAULT NULL,
  `cost` double DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `branchId` int DEFAULT NULL,
  `companyId` int NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Asset_companyId_idx` (`companyId`),
  KEY `Asset_branchId_idx` (`branchId`),
  KEY `Asset_serial_idx` (`serial`),
  KEY `Asset_deletedAt_idx` (`deletedAt`),
  CONSTRAINT `Asset_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Asset_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Asset`
--

LOCK TABLES `Asset` WRITE;
/*!40000 ALTER TABLE `Asset` DISABLE KEYS */;
INSERT INTO `Asset` VALUES (1,'Laptop Dell','Laptop','DL-123456','Dell','Latitude 5420','2024-01-10 00:00:00.000',1350000,'2026-09-14 17:49:38.071','2026-09-14 17:49:38.071',1,1,NULL),(2,'Impresora HP','Impresora','HP-987654','HP','LaserJet Pro M404','2024-03-15 00:00:00.000',950000,'2026-09-14 17:49:38.112','2026-09-14 17:49:38.112',2,2,NULL);
/*!40000 ALTER TABLE `Asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssetAssignment`
--

DROP TABLE IF EXISTS `AssetAssignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetAssignment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assetId` int NOT NULL,
  `employeeId` int NOT NULL,
  `assignedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `returnedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `AssetAssignment_assetId_idx` (`assetId`),
  KEY `AssetAssignment_employeeId_idx` (`employeeId`),
  CONSTRAINT `AssetAssignment_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `AssetAssignment_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssetAssignment`
--

LOCK TABLES `AssetAssignment` WRITE;
/*!40000 ALTER TABLE `AssetAssignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssetAssignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssetAssignmentDocument`
--

DROP TABLE IF EXISTS `AssetAssignmentDocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetAssignmentDocument` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assignmentId` int NOT NULL,
  `documentNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `generatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `generatedById` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AssetAssignmentDocument_assignmentId_key` (`assignmentId`),
  KEY `AssetAssignmentDocument_assignmentId_idx` (`assignmentId`),
  KEY `AssetAssignmentDocument_generatedById_fkey` (`generatedById`),
  CONSTRAINT `AssetAssignmentDocument_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `AssetAssignment` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `AssetAssignmentDocument_generatedById_fkey` FOREIGN KEY (`generatedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssetAssignmentDocument`
--

LOCK TABLES `AssetAssignmentDocument` WRITE;
/*!40000 ALTER TABLE `AssetAssignmentDocument` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssetAssignmentDocument` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssetDetail`
--

DROP TABLE IF EXISTS `AssetDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetDetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assetId` int NOT NULL,
  `ram_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ram_capacity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hdd_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hdd_capacity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pro_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pro_detail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mbr_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mbr_detail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gra_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gra_detail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `monitor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mon_detail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyboard` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_detail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mouse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mou_detail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AssetDetail_assetId_key` (`assetId`),
  CONSTRAINT `AssetDetail_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssetDetail`
--

LOCK TABLES `AssetDetail` WRITE;
/*!40000 ALTER TABLE `AssetDetail` DISABLE KEYS */;
INSERT INTO `AssetDetail` VALUES (1,1,'DDR4','16GB','SSD','512GB','Intel','i5 11th Gen','Dell','OEM','Intel','UHD Graphics','14\"','Full HD','QWERTY','Retroiluminado','Externo','USB');
/*!40000 ALTER TABLE `AssetDetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AuditLog`
--

DROP TABLE IF EXISTS `AuditLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AuditLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `companyId` int DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityId` int DEFAULT NULL,
  `method` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `beforeData` json DEFAULT NULL,
  `afterData` json DEFAULT NULL,
  `statusCode` int DEFAULT NULL,
  `error` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `AuditLog_userId_fkey` (`userId`),
  KEY `AuditLog_companyId_fkey` (`companyId`),
  CONSTRAINT `AuditLog_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AuditLog`
--

LOCK TABLES `AuditLog` WRITE;
/*!40000 ALTER TABLE `AuditLog` DISABLE KEYS */;
INSERT INTO `AuditLog` VALUES (1,NULL,NULL,'POST','auth',NULL,'POST','/auth/login','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 17:51:06.480'),(2,NULL,NULL,'POST','auth',NULL,'POST','/auth/login','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 17:51:15.694'),(3,NULL,NULL,'POST','auth',NULL,'POST','/auth/login','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 17:51:59.623'),(4,1,NULL,'PATCH','roles',NULL,'PATCH','/roles/4','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 17:52:44.873'),(5,1,NULL,'PATCH','roles',NULL,'PATCH','/roles/5','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 17:53:06.339'),(6,NULL,NULL,'POST','auth',NULL,'POST','/auth/login','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 17:53:12.464'),(7,NULL,NULL,'POST','auth',NULL,'POST','/auth/login','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 18:58:32.535'),(8,NULL,NULL,'POST','auth',NULL,'POST','/auth/login','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 18:58:45.647'),(9,NULL,NULL,'POST','auth',NULL,'POST','/auth/login','::ffff:127.0.0.1',NULL,NULL,NULL,NULL,NULL,'2026-09-14 19:45:39.606');
/*!40000 ALTER TABLE `AuditLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Branch`
--

DROP TABLE IF EXISTS `Branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Branch` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Branch_companyId_idx` (`companyId`),
  KEY `Branch_deletedAt_idx` (`deletedAt`),
  CONSTRAINT `Branch_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branch`
--

LOCK TABLES `Branch` WRITE;
/*!40000 ALTER TABLE `Branch` DISABLE KEYS */;
INSERT INTO `Branch` VALUES (1,'MAIN','Sede Principal','Calle 123 #45-67','principal@empresa1.demo',1,NULL),(2,'MAIN','Sede Principal','Carrera 45 #12-89','principal@empresa2.demo',2,NULL);
/*!40000 ALTER TABLE `Branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Company`
--

DROP TABLE IF EXISTS `Company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `planId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Company_nit_key` (`nit`),
  KEY `Company_planId_fkey` (`planId`),
  CONSTRAINT `Company_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Company`
--

LOCK TABLES `Company` WRITE;
/*!40000 ALTER TABLE `Company` DISABLE KEYS */;
INSERT INTO `Company` VALUES (1,'EMPRESA1 S.A.S','900900900-1',NULL,1,'2026-09-14 17:49:36.488',1),(2,'EMPRESA2 S.A.S','800800800-1',NULL,1,'2026-09-14 17:49:36.496',2);
/*!40000 ALTER TABLE `Company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Credential`
--

DROP TABLE IF EXISTS `Credential`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Credential` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int NOT NULL,
  `accessMode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'copy_open',
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Credential_companyId_idx` (`companyId`),
  KEY `Credential_deletedAt_idx` (`deletedAt`),
  CONSTRAINT `Credential_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Credential`
--

LOCK TABLES `Credential` WRITE;
/*!40000 ALTER TABLE `Credential` DISABLE KEYS */;
/*!40000 ALTER TABLE `Credential` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employee`
--

DROP TABLE IF EXISTS `Employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int NOT NULL,
  `branchId` int DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Employee_companyId_idx` (`companyId`),
  KEY `Employee_branchId_fkey` (`branchId`),
  KEY `Employee_deletedAt_idx` (`deletedAt`),
  CONSTRAINT `Employee_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Employee_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee`
--

LOCK TABLES `Employee` WRITE;
/*!40000 ALTER TABLE `Employee` DISABLE KEYS */;
INSERT INTO `Employee` VALUES (1,'Juan Pérez','Desarrollador','juan@empresa1.demo',NULL,1,1,NULL),(2,'María Gómez','Soporte TI','maria@empresa1.demo',NULL,1,1,NULL),(3,'Carlos Ramírez','Bodeguero','carlos@empresa2.demo',NULL,2,2,NULL),(4,'Laura Martínez','Contadora','laura@empresa2.demo',NULL,2,2,NULL);
/*!40000 ALTER TABLE `Employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invoice`
--

DROP TABLE IF EXISTS `Invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyId` int NOT NULL,
  `branchId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Invoice_companyId_idx` (`companyId`),
  KEY `Invoice_branchId_idx` (`branchId`),
  KEY `Invoice_date_idx` (`date`),
  KEY `Invoice_deletedAt_idx` (`deletedAt`),
  CONSTRAINT `Invoice_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Invoice_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invoice`
--

LOCK TABLES `Invoice` WRITE;
/*!40000 ALTER TABLE `Invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `Invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvoiceItem`
--

DROP TABLE IF EXISTS `InvoiceItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvoiceItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` int NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unitPrice` double NOT NULL,
  `tax` double DEFAULT NULL,
  `total` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `InvoiceItem_invoiceId_idx` (`invoiceId`),
  CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvoiceItem`
--

LOCK TABLES `InvoiceItem` WRITE;
/*!40000 ALTER TABLE `InvoiceItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `InvoiceItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Maintenance`
--

DROP TABLE IF EXISTS `Maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Maintenance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost` double DEFAULT NULL,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `assetId` int NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Maintenance_assetId_idx` (`assetId`),
  KEY `Maintenance_deletedAt_idx` (`deletedAt`),
  CONSTRAINT `Maintenance_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Maintenance`
--

LOCK TABLES `Maintenance` WRITE;
/*!40000 ALTER TABLE `Maintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `Maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permission`
--

DROP TABLE IF EXISTS `Permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_module_action_key` (`module`,`action`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permission`
--

LOCK TABLES `Permission` WRITE;
/*!40000 ALTER TABLE `Permission` DISABLE KEYS */;
INSERT INTO `Permission` VALUES (1,'companies.create','crear','companies','create'),(2,'companies.read','ver','companies','read'),(3,'companies.update','actualizar','companies','update'),(4,'companies.delete','eliminar','companies','delete'),(5,'companies.softdelete','eliminar (lógico)','companies','softdelete'),(6,'users.create','crear','users','create'),(7,'users.read','ver','users','read'),(8,'users.update','actualizar','users','update'),(9,'users.delete','eliminar','users','delete'),(10,'users.softdelete','eliminar (lógico)','users','softdelete'),(11,'roles.create','crear','roles','create'),(12,'roles.read','ver','roles','read'),(13,'roles.update','actualizar','roles','update'),(14,'roles.delete','eliminar','roles','delete'),(15,'roles.softdelete','eliminar (lógico)','roles','softdelete'),(16,'roles.permissions.create','crear','roles.permissions','create'),(17,'roles.permissions.read','ver','roles.permissions','read'),(18,'roles.permissions.update','actualizar','roles.permissions','update'),(19,'roles.permissions.delete','eliminar','roles.permissions','delete'),(20,'roles.permissions.softdelete','eliminar (lógico)','roles.permissions','softdelete'),(21,'branches.create','crear','branches','create'),(22,'branches.read','ver','branches','read'),(23,'branches.update','actualizar','branches','update'),(24,'branches.delete','eliminar','branches','delete'),(25,'branches.softdelete','eliminar (lógico)','branches','softdelete'),(26,'plans.create','crear','plans','create'),(27,'plans.read','ver','plans','read'),(28,'plans.update','actualizar','plans','update'),(29,'plans.delete','eliminar','plans','delete'),(30,'plans.softdelete','eliminar (lógico)','plans','softdelete'),(31,'employees.create','crear','employees','create'),(32,'employees.read','ver','employees','read'),(33,'employees.update','actualizar','employees','update'),(34,'employees.delete','eliminar','employees','delete'),(35,'employees.softdelete','eliminar (lógico)','employees','softdelete'),(36,'assets.create','crear','assets','create'),(37,'assets.read','ver','assets','read'),(38,'assets.update','actualizar','assets','update'),(39,'assets.delete','eliminar','assets','delete'),(40,'assets.softdelete','eliminar (lógico)','assets','softdelete'),(41,'asset_assignments.create','crear','asset_assignments','create'),(42,'asset_assignments.read','ver','asset_assignments','read'),(43,'asset_assignments.update','actualizar','asset_assignments','update'),(44,'asset_assignments.delete','eliminar','asset_assignments','delete'),(45,'asset_assignments.softdelete','eliminar (lógico)','asset_assignments','softdelete'),(46,'maintenances.create','crear','maintenances','create'),(47,'maintenances.read','ver','maintenances','read'),(48,'maintenances.update','actualizar','maintenances','update'),(49,'maintenances.delete','eliminar','maintenances','delete'),(50,'maintenances.softdelete','eliminar (lógico)','maintenances','softdelete'),(51,'tickets.create','crear','tickets','create'),(52,'tickets.read','ver','tickets','read'),(53,'tickets.update','actualizar','tickets','update'),(54,'tickets.delete','eliminar','tickets','delete'),(55,'tickets.softdelete','eliminar (lógico)','tickets','softdelete'),(56,'invoices.create','crear','invoices','create'),(57,'invoices.read','ver','invoices','read'),(58,'invoices.update','actualizar','invoices','update'),(59,'invoices.delete','eliminar','invoices','delete'),(60,'invoices.softdelete','eliminar (lógico)','invoices','softdelete'),(61,'credentials.create','crear','credentials','create'),(62,'credentials.read','ver','credentials','read'),(63,'credentials.update','actualizar','credentials','update'),(64,'credentials.delete','eliminar','credentials','delete'),(65,'credentials.softdelete','eliminar (lógico)','credentials','softdelete'),(66,'tasks.create','crear','tasks','create'),(67,'tasks.read','ver','tasks','read'),(68,'tasks.update','actualizar','tasks','update'),(69,'tasks.delete','eliminar','tasks','delete'),(70,'tasks.softdelete','eliminar (lógico)','tasks','softdelete'),(71,'dashboard.create','crear','dashboard','create'),(72,'dashboard.read','ver','dashboard','read'),(73,'dashboard.update','actualizar','dashboard','update'),(74,'dashboard.delete','eliminar','dashboard','delete'),(75,'dashboard.softdelete','eliminar (lógico)','dashboard','softdelete'),(76,'audit.create','crear','audit','create'),(77,'audit.read','ver','audit','read'),(78,'audit.update','actualizar','audit','update'),(79,'audit.delete','eliminar','audit','delete'),(80,'audit.softdelete','eliminar (lógico)','audit','softdelete'),(81,'credentials.reveal','revelar clave','credentials','reveal');
/*!40000 ALTER TABLE `Permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Plan`
--

DROP TABLE IF EXISTS `Plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `maxUsers` int NOT NULL,
  `maxAssets` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Plan`
--

LOCK TABLES `Plan` WRITE;
/*!40000 ALTER TABLE `Plan` DISABLE KEYS */;
INSERT INTO `Plan` VALUES (1,'Básico',200000,5,50,'2026-09-14 17:49:36.467'),(2,'Premium',500000,10,100,'2026-09-14 17:49:36.474');
/*!40000 ALTER TABLE `Plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isGlobal` tinyint(1) NOT NULL DEFAULT '0',
  `companyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Role_companyId_idx` (`companyId`),
  CONSTRAINT `Role_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'SOPORTE','Soporte Sistema',1,NULL),(2,'ADMIN','Administrador Empresa',0,1),(3,'ADMIN','Administrador Empresa',0,2),(4,'USER','Usuario Empresa',0,1),(5,'USER','Usuario Empresa',0,2);
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RolePermission`
--

DROP TABLE IF EXISTS `RolePermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RolePermission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `RolePermission_roleId_permissionId_key` (`roleId`,`permissionId`),
  KEY `RolePermission_permissionId_fkey` (`permissionId`),
  CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=312 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RolePermission`
--

LOCK TABLES `RolePermission` WRITE;
/*!40000 ALTER TABLE `RolePermission` DISABLE KEYS */;
INSERT INTO `RolePermission` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10),(11,1,11),(12,1,12),(13,1,13),(14,1,14),(15,1,15),(16,1,16),(17,1,17),(18,1,18),(19,1,19),(20,1,20),(21,1,21),(22,1,22),(23,1,23),(24,1,24),(25,1,25),(26,1,26),(27,1,27),(28,1,28),(29,1,29),(30,1,30),(31,1,31),(32,1,32),(33,1,33),(34,1,34),(35,1,35),(36,1,36),(37,1,37),(38,1,38),(39,1,39),(40,1,40),(41,1,41),(42,1,42),(43,1,43),(44,1,44),(45,1,45),(46,1,46),(47,1,47),(48,1,48),(49,1,49),(50,1,50),(51,1,51),(52,1,52),(53,1,53),(54,1,54),(55,1,55),(56,1,56),(57,1,57),(58,1,58),(59,1,59),(60,1,60),(61,1,61),(62,1,62),(63,1,63),(64,1,64),(65,1,65),(66,1,66),(67,1,67),(68,1,68),(69,1,69),(70,1,70),(71,1,71),(72,1,72),(73,1,73),(74,1,74),(75,1,75),(76,1,76),(77,1,77),(78,1,78),(79,1,79),(80,1,80),(81,1,81),(82,2,21),(84,2,22),(86,2,23),(88,2,24),(90,2,25),(92,2,31),(94,2,32),(96,2,33),(98,2,34),(100,2,35),(102,2,36),(104,2,37),(106,2,38),(108,2,39),(110,2,40),(112,2,41),(114,2,42),(116,2,43),(118,2,44),(120,2,45),(122,2,46),(124,2,47),(126,2,48),(128,2,49),(130,2,50),(132,2,51),(134,2,52),(136,2,53),(138,2,54),(140,2,55),(142,2,56),(144,2,57),(146,2,58),(148,2,59),(150,2,60),(152,2,61),(154,2,62),(156,2,63),(158,2,64),(160,2,65),(162,2,66),(164,2,67),(166,2,68),(168,2,69),(170,2,70),(172,2,71),(174,2,72),(176,2,73),(178,2,74),(180,2,75),(182,2,76),(184,2,77),(186,2,78),(188,2,79),(190,2,80),(83,3,21),(85,3,22),(87,3,23),(89,3,24),(91,3,25),(93,3,31),(95,3,32),(97,3,33),(99,3,34),(101,3,35),(103,3,36),(105,3,37),(107,3,38),(109,3,39),(111,3,40),(113,3,41),(115,3,42),(117,3,43),(119,3,44),(121,3,45),(123,3,46),(125,3,47),(127,3,48),(129,3,49),(131,3,50),(133,3,51),(135,3,52),(137,3,53),(139,3,54),(141,3,55),(143,3,56),(145,3,57),(147,3,58),(149,3,59),(151,3,60),(153,3,61),(155,3,62),(157,3,63),(159,3,64),(161,3,65),(163,3,66),(165,3,67),(167,3,68),(169,3,69),(171,3,70),(173,3,71),(175,3,72),(177,3,73),(179,3,74),(181,3,75),(183,3,76),(185,3,77),(187,3,78),(189,3,79),(191,3,80),(258,4,21),(259,4,22),(260,4,23),(261,4,31),(262,4,32),(263,4,33),(264,4,36),(265,4,37),(266,4,38),(267,4,41),(268,4,42),(269,4,43),(270,4,46),(271,4,47),(272,4,48),(273,4,56),(274,4,57),(275,4,58),(276,4,61),(277,4,62),(278,4,63),(279,4,66),(280,4,67),(281,4,68),(282,4,71),(283,4,72),(284,4,73),(285,5,21),(286,5,22),(287,5,23),(288,5,31),(289,5,32),(290,5,33),(291,5,36),(292,5,37),(293,5,38),(294,5,41),(295,5,42),(296,5,43),(297,5,46),(298,5,47),(299,5,48),(300,5,56),(301,5,57),(302,5,58),(303,5,61),(304,5,62),(305,5,63),(306,5,66),(307,5,67),(308,5,68),(309,5,71),(310,5,72),(311,5,73);
/*!40000 ALTER TABLE `RolePermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Task`
--

DROP TABLE IF EXISTS `Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OPEN',
  `priority` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dueDate` datetime(3) DEFAULT NULL,
  `closedAt` datetime(3) DEFAULT NULL,
  `solution` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int NOT NULL,
  `createdById` int NOT NULL,
  `assignedToId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Task_companyId_idx` (`companyId`),
  KEY `Task_status_idx` (`status`),
  KEY `Task_assignedToId_idx` (`assignedToId`),
  KEY `Task_createdById_fkey` (`createdById`),
  KEY `Task_deletedAt_idx` (`deletedAt`),
  CONSTRAINT `Task_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Task_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Task_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Task`
--

LOCK TABLES `Task` WRITE;
/*!40000 ALTER TABLE `Task` DISABLE KEYS */;
INSERT INTO `Task` VALUES (1,'Configurar Laptop Nueva','Configuración equipo nuevo','OPEN','HIGH',NULL,NULL,NULL,1,2,NULL,'2026-09-14 17:49:38.085','2026-09-14 17:49:38.085',NULL),(2,'Actualizar antivirus','Equipo gerencia','DONE','MEDIUM',NULL,NULL,NULL,1,2,NULL,'2026-09-14 17:49:38.085','2026-09-14 17:49:38.085',NULL),(3,'Revisar inventario','Revisión Stock Bodega 1','OPEN','HIGH',NULL,NULL,NULL,2,4,NULL,'2026-09-14 17:49:38.125','2026-09-14 17:49:38.125',NULL),(4,'Instalar drivers impresora','Instalar impresora nueva área de ventas','DONE','MEDIUM',NULL,NULL,NULL,2,4,NULL,'2026-09-14 17:49:38.125','2026-09-14 17:49:38.125',NULL);
/*!40000 ALTER TABLE `Task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ticket`
--

DROP TABLE IF EXISTS `Ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ticket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyId` int NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Ticket_companyId_idx` (`companyId`),
  KEY `Ticket_status_idx` (`status`),
  KEY `Ticket_deletedAt_idx` (`deletedAt`),
  CONSTRAINT `Ticket_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ticket`
--

LOCK TABLES `Ticket` WRITE;
/*!40000 ALTER TABLE `Ticket` DISABLE KEYS */;
INSERT INTO `Ticket` VALUES (1,'No enciende el equipo','OPEN',1,NULL),(2,'Problema con correo','CLOSED',1,NULL),(3,'Impresora no imprime','OPEN',2,NULL),(4,'Actualización sistema contable','IN_PROGRESS',2,NULL);
/*!40000 ALTER TABLE `Ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TicketMessage`
--

DROP TABLE IF EXISTS `TicketMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TicketMessage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `ticketId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TicketMessage_ticketId_idx` (`ticketId`),
  KEY `TicketMessage_userId_idx` (`userId`),
  CONSTRAINT `TicketMessage_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `TicketMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TicketMessage`
--

LOCK TABLES `TicketMessage` WRITE;
/*!40000 ALTER TABLE `TicketMessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `TicketMessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `companyId` int DEFAULT NULL,
  `branchId` int DEFAULT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_code_key` (`code`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_companyId_idx` (`companyId`),
  KEY `User_roleId_idx` (`roleId`),
  KEY `User_branchId_idx` (`branchId`),
  CONSTRAINT `User_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `User_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'SOPORTE','Soporte General','soporte@system.com','$2b$10$lsPXBJ2JbTEYFwyPbEN1j.dWMEC1Tlq8TUaMiWlaW9GZ8Vr8emMmi',1,'2026-09-14 17:49:38.042',1,NULL,1),(2,'ADMIN1','Administrador Empresa 1','admin@empresa1.demo','$2b$10$yLlAYY3bZZ//lzd0.DCvzu8QTXt9LaiWpbFbt/frsR7c5wuYBVzqC',1,'2026-09-14 17:49:38.055',1,NULL,2),(3,'USER1','Usuario Empresa 1','user@empresa1.demo','$2b$10$LSRHLidcFnx.Jm14cvodzubkVcUKWEQoctT0qVNKUYlTqgv/gFooO',1,'2026-09-14 17:49:38.060',1,NULL,4),(4,'ADMIN2','Administrador Empresa 2','admin@empresa2.demo','$2b$10$yLlAYY3bZZ//lzd0.DCvzu8QTXt9LaiWpbFbt/frsR7c5wuYBVzqC',1,'2026-09-14 17:49:38.096',2,NULL,3),(5,'USER2','Usuario Empresa 2','user@empresa2.demo','$2b$10$LSRHLidcFnx.Jm14cvodzubkVcUKWEQoctT0qVNKUYlTqgv/gFooO',1,'2026-09-14 17:49:38.101',2,NULL,5);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('6f97be58-c793-4e53-bcd0-fbcd408d6341','274c2677f7e94a8fed3172228c3dfc9f2454781bc7618ddf6d5e35022c94ebd0','2026-09-14 17:49:31.368','20260910220147_sysmanager_soft_delete_encryption_access',NULL,NULL,'2026-09-14 17:49:30.671',1),('c4f75684-ad74-468f-9df0-5ad7d97c3847','afe18f9af1077df51305a6b3e81af3cfeab35ab004c165a266660b87d8e571be','2026-09-14 17:49:30.666','20260301030908_init',NULL,NULL,'2026-09-14 17:49:27.338',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'coremanager'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-27 11:44:40
