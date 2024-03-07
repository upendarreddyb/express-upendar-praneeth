-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quiz
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_type` varchar(45) DEFAULT NULL,
  `question` varchar(500) DEFAULT NULL,
  `subject` varchar(45) DEFAULT NULL,
  `deficulty_level` varchar(45) DEFAULT NULL,
  `grade_level` varchar(45) DEFAULT NULL,
  `option_a` varchar(45) DEFAULT NULL,
  `option_b` varchar(45) DEFAULT NULL,
  `option_c` varchar(45) DEFAULT NULL,
  `option_d` varchar(45) DEFAULT NULL,
  `correct_option` varchar(45) DEFAULT NULL,
  `cdate` timestamp(6) NULL DEFAULT NULL,
  `update_time` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'Text','find sum of two numbers a=20 ,b=40 ','maths','easy',NULL,'60','65','70','89',NULL,'2024-03-05 18:06:03.147000',NULL),(2,'Text','find the multiplication of given two numbers a=30,b=90','maths','medium',NULL,'2700','2770','2800','2900',NULL,'2024-03-05 18:10:27.463000',NULL),(3,'Text','csgv jvcjvzddjhsadfjsajhsgdcs\r\ncsgv jvcjvzddjhsadfjsajhsgdcs\r\ncsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcs\r\ncsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcscsgv jvcjvzddjhsadfjsajhsgdcs\r\n','english','easy',NULL,'A','b','c','d',NULL,'2024-03-05 18:11:38.674000',NULL),(5,'Text','Cobalt is an important cofactor that often inhibits enzyme activity involved in cellular respiration, such as catalase.\r\n\r\n(a) Using the complete electron configuration, determine the electron configuration of \r\n(b) Draw the orbital diagram of the \r\n3\r\nd\r\n3d electrons of \r\nC\r\no\r\nCo.','physics','hard',NULL,'vdv','vdvc','vvcvcvb','cvbcvb',NULL,'2024-03-06 04:44:08.564000',NULL),(6,'Text','dcdcs','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:26.171000',NULL),(7,'Text','dcdcs','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:26.346000',NULL),(8,'Text','dcdcs','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:26.512000',NULL),(9,'Text','dcdcs','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:26.683000',NULL),(10,'Text','dcdcs','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:26.846000',NULL),(11,'Text','dcdcs','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:27.018000',NULL),(12,'Text','dcdcs','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:27.176000',NULL),(13,'Text','dcdcs','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:27.327000',NULL),(14,'Image','Netflix_Logo_PMS (1).png','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:36.581000',NULL),(15,'Image','Netflix_Logo_PMS (1).png','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:36.752000',NULL),(16,'Image','Netflix_Logo_PMS (1).png','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:36.927000',NULL),(17,'Image','Netflix_Logo_PMS (1).png','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:37.132000',NULL),(18,'Image','Netflix_Logo_PMS (1).png','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:37.298000',NULL),(19,'Image','Netflix_Logo_PMS (1).png','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:37.617000',NULL),(20,'Image','Netflix_Logo_PMS (1).png','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:39.098000',NULL),(21,'Image','Netflix_Logo_PMS (1).png','maths','hard',NULL,'dscs','dcsdc','sdcsdc','sdcsdc',NULL,'2024-03-06 06:41:39.282000',NULL),(22,'Image','WhatsApp Image 2023-05-16 at 15.57.26.jpeg','maths','hard',NULL,'AAAA','BBB','CCCC','DDDD',NULL,'2024-03-07 10:10:12.072000',NULL),(23,'Image','WhatsApp Image 2023-05-16 at 15.57.26.jpeg','maths','hard',NULL,'AAAA','BBB','CCCC','DDDD',NULL,'2024-03-07 10:10:25.565000',NULL);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-07 16:25:12
