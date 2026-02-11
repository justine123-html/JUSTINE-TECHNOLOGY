-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: electronhub
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (4,'Accessories'),(8,'Cameras'),(9,'Gamings'),(5,'Headphones'),(2,'Laptops'),(1,'Smartphones'),(6,'Smartwatches'),(3,'Tablets'),(7,'TVs');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,2859974.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,3500000.00,'paid','2026-02-03 12:40:53');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `review_count` int DEFAULT '0',
  `stock` int DEFAULT '0',
  `image` varchar(500) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `description` text,
  `specs` json DEFAULT NULL,
  `shipping` varchar(100) DEFAULT NULL,
  `delivery` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 14 Pro Max','smartphones','apple',1099.99,1199.99,4.80,1245,45,'images/photo/iphone13b.png','new','Latest iPhone with premium features including Dynamic Island, Always-On display, and professional-grade camera system.','{\"OS\": \"iOS 16\", \"Camera\": \"48MP Main + 12MP Ultra Wide + 12MP Telephoto\", \"Battery\": \"Up to 29 hours video playback\", \"Display\": \"6.7-inch Super Retina XDR\", \"Storage\": \"256GB\", \"Processor\": \"A16 Bionic\"}','Free shipping','Delivery in 2-3 business days','2026-01-30 14:40:53','2026-01-30 14:40:53'),(2,'Samsung Galaxy S23 Ultra','smartphones','samsung',1199.99,1299.99,4.70,932,67,'images/photo/sumsung7.png','sale','Flagship Samsung smartphone with S Pen, advanced camera system, and powerful performance.','{\"OS\": \"Android 13 with One UI 5.1\", \"Camera\": \"200MP Main + 12MP Ultra Wide + 10MP Telephoto x2\", \"Battery\": \"5000mAh\", \"Display\": \"6.8-inch Dynamic AMOLED 2X\", \"Storage\": \"512GB\", \"Processor\": \"Snapdragon 8 Gen 2\"}','Free shipping','Delivery in 3-4 business days','2026-01-30 14:40:53','2026-01-30 14:40:53'),(3,'MacBook Pro 16-inch','laptops','apple',2499.99,2699.99,4.90,876,28,'images/photo/macbook5.png','bestseller','Professional laptop for creators with M2 Pro/Max chip, Liquid Retina XDR display, and exceptional battery life.','{\"RAM\": \"16GB\", \"Battery\": \"Up to 22 hours\", \"Display\": \"16.2-inch Liquid Retina XDR\", \"Storage\": \"512GB SSD\", \"Graphics\": \"19-core GPU\", \"Processor\": \"M2 Pro 12-core\"}','Free shipping','Delivery in 5-7 business days','2026-01-30 14:40:53','2026-01-30 14:40:53'),(4,'Dell XPS 15 Laptop','laptops','dell',1799.99,1999.99,4.60,543,24,'images/photo/dell-xps.png','sale','Premium Windows laptop with InfinityEdge display, powerful Intel processors, and premium build quality.','{\"RAM\": \"16GB DDR5\", \"Battery\": \"86Wh\", \"Display\": \"15.6-inch 3.5K OLED\", \"Storage\": \"1TB SSD\", \"Graphics\": \"NVIDIA RTX 4050\", \"Processor\": \"Intel Core i7-13700H\"}','Free shipping','Delivery in 3-5 business days','2026-01-30 14:40:54','2026-01-30 14:40:54'),(5,'Sony WH-1000XM5 Headphones','headphones','sony',399.99,449.99,4.80,2156,89,'images/photo/headphones.png','bestseller','Industry-leading noise cancelling wireless headphones with exceptional sound quality and comfort.','{\"Type\": \"Over-ear wireless\", \"Weight\": \"250g\", \"Battery\": \"Up to 30 hours\", \"Charging\": \"Quick charge (3 min = 3 hours)\", \"Connectivity\": \"Bluetooth 5.2, NFC\", \"Noise Cancelling\": \"Yes, industry-leading\"}','Free shipping','Delivery in 2-3 business days','2026-01-30 14:40:54','2026-01-30 14:40:54'),(6,'Apple Watch Series 8','watches','apple',429.99,499.99,4.50,1876,112,'images/photo/smartwatch.png','bestseller','Advanced smartwatch with temperature sensing, crash detection, and always-on Retina display.','{\"Battery\": \"Up to 18 hours\", \"Display\": \"Always-on Retina LTPO OLED\", \"Features\": \"ECG, Blood Oxygen, Temperature sensing\", \"Case Size\": \"45mm\", \"Connectivity\": \"GPS + Cellular option\", \"Water Resistance\": \"50m\"}','Free shipping','Delivery in 1-2 business days','2026-01-30 14:40:54','2026-01-30 14:40:54'),(7,'Samsung 75-inch QLED TV','tvs','samsung',1999.99,2499.99,4.80,432,18,'images/photo/samsung-75-inch-TV.png','sale','Large 4K QLED television with Quantum HDR, Object Tracking Sound, and smart TV features.','{\"Size\": \"75-inch\", \"Audio\": \"Object Tracking Sound+\", \"Smart TV\": \"Tizen OS\", \"Resolution\": \"4K UHD (3840 x 2160)\", \"Refresh Rate\": \"120Hz\", \"Display Technology\": \"QLED with Quantum HDR\"}','Free shipping','Delivery in 7-10 business days','2026-01-30 14:40:54','2026-01-30 14:40:54'),(8,'PlayStation 5 Console','gaming','sony',499.99,549.99,4.70,2987,36,'images/photo/playstation-5.png','bestseller','Next-gen gaming console with ultra-high speed SSD, ray tracing, and 4K gaming capabilities.','{\"Storage\": \"825GB SSD\", \"Graphics\": \"Ray tracing support\", \"Controller\": \"DualSense wireless\", \"Resolution\": \"Up to 8K\", \"Performance\": \"Up to 120fps\", \"Backward Compatibility\": \"PS4 games\"}','Free shipping','Delivery in 3-5 business days','2026-01-30 14:40:54','2026-01-30 14:40:54'),(9,'iPad Pro 12.9-inch','tablets','apple',1099.99,1199.99,4.80,765,32,'images/photo/ipad.png','new','Professional tablet with M2 chip, Liquid Retina XDR display, and compatibility with Apple Pencil.','{\"Camera\": \"12MP Wide + 10MP Ultra Wide\", \"Battery\": \"Up to 10 hours\", \"Display\": \"12.9-inch Liquid Retina XDR\", \"Storage\": \"256GB\", \"Processor\": \"M2 chip\", \"Connectivity\": \"Wi-Fi 6E, 5G option\"}','Free shipping','Delivery in 2-4 business days','2026-01-30 14:40:54','2026-01-30 14:40:54'),(10,'Microsoft Surface Pro 9','tablets','microsoft',1299.99,1399.99,4.40,421,19,'images/photo/surface.png','sale','Versatile 2-in-1 tablet/laptop with Intel processors and premium design.','{\"OS\": \"Windows 11\", \"RAM\": \"16GB\", \"Battery\": \"Up to 15.5 hours\", \"Display\": \"13-inch PixelSense\", \"Storage\": \"512GB SSD\", \"Processor\": \"Intel Core i7\"}','Free shipping','Delivery in 4-6 business days','2026-01-30 14:40:55','2026-01-30 14:40:55');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@justinetech.com',NULL,'admin123','admin','2026-01-30 14:40:55','2026-02-04 13:46:18'),(2,'John Doe','user@example.com',NULL,'123456','user','2026-01-30 14:40:55','2026-02-01 19:43:42'),(3,'justine','karuga@gmail.com',NULL,'123456','user','2026-02-01 20:00:33','2026-02-01 20:00:33'),(4,'jesca','jesca@gmail.com',NULL,'123456','user','2026-02-01 20:01:30','2026-02-01 20:01:30'),(5,'mimi','mimi@gmail.com',NULL,'123456','user','2026-02-01 20:31:28','2026-02-01 20:31:28'),(6,'japhet','japhet@gmail.com',NULL,'123456','user','2026-02-02 07:43:32','2026-02-02 07:43:32'),(7,'dany','dany@gmail.com',NULL,'654321','user','2026-02-03 07:52:32','2026-02-03 07:52:32'),(8,'sarah','sarah@gmail.com',NULL,'123456','user','2026-02-04 16:20:19','2026-02-04 16:20:19'),(9,'justine karugaba','karugabajastin46@gmail.com',NULL,'123456','user','2026-02-06 10:13:06','2026-02-06 10:13:06'),(10,'scovia','scovia@gmail.com',NULL,'0987654321','user','2026-02-06 20:21:18','2026-02-06 20:21:18'),(11,'ester zabron','ester@gmail.com',NULL,'1234567890','user','2026-02-09 10:24:42','2026-02-09 10:24:42'),(12,'ellah','ellah@gmail.com',NULL,'justine123','user','2026-02-09 20:26:31','2026-02-09 20:26:31'),(13,'madina@gmail.com','madina@gmail.com',NULL,'madina123','user','2026-02-10 20:31:06','2026-02-10 20:31:06'),(14,'mwemezi supery','mwemezi@gmail.com','0714567876','123456','user','2026-02-10 21:05:45','2026-02-10 21:05:45'),(15,'kefas','kefas@gmail.com','0712345678','kefas123','user','2026-02-10 21:28:35','2026-02-10 21:28:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-11 17:41:38
