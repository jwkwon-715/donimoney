-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: donimoney_dev_db
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.20.04.1

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
-- Table structure for table `appear`
--

DROP TABLE IF EXISTS `appear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appear` (
  `scene_id` int NOT NULL COMMENT '장면 ID',
  `character_id` int NOT NULL COMMENT '캐릭터 ID',
  `character_face` varchar(50) DEFAULT NULL COMMENT '등장 캐릭터의 표정',
  `x_position` int DEFAULT NULL COMMENT '화면 상 X 좌표',
  `y_position` int DEFAULT NULL COMMENT '화면 상 Y 좌표',
  PRIMARY KEY (`scene_id`,`character_id`),
  UNIQUE KEY `appear_scene_id_character_id_unique` (`scene_id`,`character_id`),
  KEY `character_id` (`character_id`),
  CONSTRAINT `appear_ibfk_1` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`scene_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appear_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `story_character` (`character_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appear`
--

LOCK TABLES `appear` WRITE;
/*!40000 ALTER TABLE `appear` DISABLE KEYS */;
/*!40000 ALTER TABLE `appear` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `choices`
--

DROP TABLE IF EXISTS `choices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `choices` (
  `choice_id` int NOT NULL AUTO_INCREMENT,
  `scene_id` int NOT NULL,
  `next_scene_id` int NOT NULL,
  PRIMARY KEY (`choice_id`),
  KEY `scene_id` (`scene_id`),
  CONSTRAINT `choices_ibfk_1` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`scene_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `choices`
--

LOCK TABLES `choices` WRITE;
/*!40000 ALTER TABLE `choices` DISABLE KEYS */;
/*!40000 ALTER TABLE `choices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curriculum`
--

DROP TABLE IF EXISTS `curriculum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curriculum` (
  `curriculum_id` int NOT NULL AUTO_INCREMENT,
  `curriculum_title` varchar(60) NOT NULL,
  `description` text,
  PRIMARY KEY (`curriculum_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curriculum`
--

LOCK TABLES `curriculum` WRITE;
/*!40000 ALTER TABLE `curriculum` DISABLE KEYS */;
INSERT INTO `curriculum` VALUES (1,'돈이란?','돈의 역사를 자세히 배워보자!'),(2,'똑똑한 소비','현명한 소비란 무엇일까?'),(3,'저축과 용돈기입장','저축은 왜 해야 하지?'),(4,'개인정보 보호','개인정보란 무엇이고, 어떻게 안전하게 지킬 수 있을지 알아보자!'),(5,'신용과 부채 관리','신용과 부채의 의미를 배우고, 올바르게 관리하는 방법을 익혀보자!'),(6,'보험의 개념과 중요성','보험이 생긴 이유와 다양한 종류, 가입 시 주의할 점을 알아보자!'),(7,'시장과 가격 변동','시장과 가격이 변하는 이유, 수요와 공급의 원리를 살펴보자!'),(8,'투자란?','투자와 저축의 차이, 주의점은 무엇일까?'),(9,'가치란?','물가, 돈의 가치, 환율, GDP 등을 배워보자!'),(10,'기부와 나눔','기부와 나눔이 왜 중요한지 알아보자!');
/*!40000 ALTER TABLE `curriculum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialogues`
--

DROP TABLE IF EXISTS `dialogues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dialogues` (
  `dialogue_id` int NOT NULL AUTO_INCREMENT,
  `dialogue` json NOT NULL,
  `scene_id` int NOT NULL,
  PRIMARY KEY (`dialogue_id`),
  KEY `scene_id` (`scene_id`),
  CONSTRAINT `dialogues_ibfk_1` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`scene_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialogues`
--

LOCK TABLES `dialogues` WRITE;
/*!40000 ALTER TABLE `dialogues` DISABLE KEYS */;
/*!40000 ALTER TABLE `dialogues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_character_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `inventory_user_character_id_item_id` (`user_character_id`,`item_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`user_character_id`) REFERENCES `user_characters` (`user_character_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,1,1,223),(2,1,6,1),(3,1,2,451),(4,1,3,219),(6,3,2,4),(7,3,4,3),(8,3,1,1),(9,1,4,1),(10,4,1,1),(11,4,4,1),(12,4,2,2),(13,6,1,1);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(20) NOT NULL,
  `item_description` text,
  `item_price` int NOT NULL,
  `item_type` enum('잡화','가구','옷') NOT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_name` (`item_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'용돈기입장','똑똑한 소비를 위한 용돈기입장',1700,'잡화'),(2,'연필','부드럽게 써지는 연필',500,'잡화'),(3,'우유','마시면 키가 쑥쑥 자라는 우유',3000,'잡화'),(4,'지우개','몽땅 지워버리는 지우개',700,'잡화'),(5,'달걀','신선한 달걀',2500,'잡화'),(6,'카우보이 모자','최신 유행! 캐치카우팡의 카우보이 모자',5000,'옷');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jsonFiles`
--

DROP TABLE IF EXISTS `jsonFiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jsonFiles` (
  `json_id` int NOT NULL AUTO_INCREMENT COMMENT '제이슨 파일 ID',
  `json_name` varchar(255) NOT NULL COMMENT '제이슨 파일 이름',
  `json_content` json NOT NULL COMMENT '실제 제이슨 데이터',
  `story_id` int NOT NULL COMMENT '스토리 ID',
  PRIMARY KEY (`json_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `jsonFiles_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jsonFiles`
--

LOCK TABLES `jsonFiles` WRITE;
/*!40000 ALTER TABLE `jsonFiles` DISABLE KEYS */;
INSERT INTO `jsonFiles` VALUES (1,'dialog1.json','[{\"id\": 1, \"dialogs\": [{\"char\": \"nabi_basic\", \"line\": \"나는 이번 주말에 부모님이랑 놀이공원 가기로 했어.\\n게다가 새 게임기도 사주신대!\", \"name\": \"nabi\", \"type\": \"line\"}, {\"char\": \"choco_basic\", \"line\": \"와 재밌겠다! 나는 엄마랑 다음 달에 사러 가기로 했는데.\\n이번 달은 지출이 많아서 같이 줄여보기로 했거든.\", \"name\": \"choco\", \"type\": \"line\"}, {\"char\": \"todragon_curious\", \"line\": \"오잉, 어른들은 돈을 아낄 필요가 없는데?\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"choco_basic\", \"line\": \"어라, 왜?\", \"name\": \"choco\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"그냥 카드로 사면 돼! 카드에서는 돈이 계속 계속 나오니까~!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"choco_embarrassed\", \"line\": \"...\", \"name\": \"choco\", \"type\": \"line\"}, {\"char\": \"nabi_pathetic\", \"line\": \"으이구 이 바보야! 카드가 왜 무제한이냐?\", \"name\": \"nabi\", \"type\": \"line\"}, {\"char\": \"choco_basic\", \"line\": \"맞아 {이름}아. 카드로 쓴 돈은 결국 어른들이 다시 갚아야 해.\", \"name\": \"choco\", \"type\": \"line\"}, {\"char\": \"nabi_pathetic\", \"line\": \"{이름}이 너는 정말 세상 물정을 모르는구나?\\n우리 부모님은 돈을 벌기 위해서 맨날 늦게까지 일하신다구.\", \"name\": \"nabi\", \"type\": \"line\"}, {\"char\": \"todragon_embrrassed\", \"line\": \"엇 그래...?\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"todragon_shame\", \"line\": \"(카드가 있으면 뭐든 살 수 있을 줄 알았는데...)\", \"name\": \"todragon\", \"type\": \"line\"}], \"background\": \"bg_school\"}, {\"id\": 2, \"dialogs\": [{\"char\": \"todragon_shame\", \"line\": \"아무리 그래도 바보라니, 말이 너무 심하잖아!\\n으으 창피해...\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"line\": \"흠, 여기 어디쯤일텐데...\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_surprised\", \"line\": \"으악!! 깜짝이야!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_happy\", \"line\": \"와 드디어 찾았다! {이름}, 맞지?\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"으응, 나 맞는데... 넌 누구야?\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_smile\", \"line\": \"나는 돈의 요정 도니! \\n경제 관념이 부족한 아이들을 도와주기 위해 파견된 견습 요정이야!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_surprised\", \"line\": \"요, 요정이라고?\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_smile\", \"line\": \"원래 계획대로라면 어제 도착했어야 했는데 \\n길을 아주 조~금 헤매는 바람에 헤헤\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"(왠지 못 미더운데...)\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"line\": \"{이름}, 딱 봐도 경제 관념이 어려워서 친구들 앞에서 창피를 당한 모양이지?\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_embrrassed\", \"line\": \"윽, 들켰다.\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_happy\", \"line\": \"음음 그래, 하지만 이제부터는 이 도니가 도와줄테니 걱정 붙들어 매! \\n우리 같이 금융 경제를 마스터해보는 거야! 우하하~!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"(...그냥 한 번 속는 셈 치고 믿어볼까?)\", \"name\": \"todragon\", \"type\": \"line\"}], \"background\": \"bg_main\"}, {\"id\": 3, \"event\": \"history\", \"dialogs\": [{\"char\": \"dony_basic\", \"line\": \"우선 경제를 배우려면 먼저 돈이 뭔지 알아야 해!\\n지금 우리가 쓰는 돈이 어떻게 만들어졌는지 궁금하지 않아?\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"line\": \"예전에는 지금같은 형태의 돈을 쓰지 않았어.\\n그렇다면 먼저 돈이 어떻게 바뀌어 왔는지 함께 알아보자!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"name\": \"dony\", \"type\": \"show_history\", \"image\": \"dony_history1\", \"line1\": \"소금이나 곡식을 가지고 다니면서 필요한 물품을 직접 교환했어.\", \"line2\": \"하지만 물건을 사기 위해 저것들을 매일 들고 다녀야 한다고 생각해봐! \\n가지고 다니기도 힘들고, 옮기는 동안 상하기도 해서 불편함이 많았겠지?\"}, {\"char\": \"dony_basic\", \"name\": \"dony\", \"type\": \"show_history\", \"image\": \"dony_history2\", \"line1\": \"그래서 이 다음에는 들고 다니기 편하고 잘 변하지 않는 금속을 사용하게 됐어.\", \"line2\": \"하지만 무게를 재기 위해 매번 저울이 필요하고, 이게 진짜 금속이 맞는지 확인해야 했어.\"}, {\"char\": \"dony_basic\", \"name\": \"dony\", \"type\": \"show_history\", \"image\": \"dony_history3\", \"line1\": \"이런 문제를 해결하기 위해 이 금속을 아예 똑같은 모양으로 만들어서 사용하기 시작한 거야!\", \"line2\": \"너도 동전 많이 써봤을 거야!\\n동전을 한꺼번에 많이 들고 다니기엔 무겁지 않았어?\"}, {\"char\": \"dony_basic\", \"name\": \"dony\", \"type\": \"show_history\", \"image\": \"dony_history4\", \"line1\": \"그래서 이번에는 아주 가벼운 종이를 활용해서 돈을 만든 거야.\", \"line2\": \"지폐는 아직도 많이 쓰고 있지? 동전보다 들고 다니기도 편하고 말야!\"}, {\"char\": \"dony_basic\", \"name\": \"dony\", \"type\": \"show_history\", \"image\": \"dony_history5\", \"line1\": \"요즘에는 아예 돈을 들고 다니지 않고, 휴대전화나 카드 하나만 있으면 쉽게  결제할 수 있게 됐어! 요즘 가장 많이 쓰이는 방법이지.\", \"line2\": \"이런 식으로 돈은 시대에 맞게 계속 변화해서 지금의 모습이 된 거야.\"}, {\"char\": \"dony_smile\", \"line\": \"{이름}, 이제 조금은 돈에 대해 익숙해졌겠지?\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_happy\", \"line\": \"우와 그렇구나, 신기하다!\", \"name\": \"todragon\", \"type\": \"line\"}], \"background\": \"#F5FAFF\"}, {\"id\": 4, \"dialogs\": [{\"char\": \"dony_basic\", \"line\": \"그럼 {이름}, 네가 생각하기에 돈은 왜 필요한 것 같아?\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"name\": \"dony\", \"type\": \"question\", \"answer0\": \"맛있는걸 사먹기 위해서\", \"answer1\": \"아픈 곳을 낫게 하기 위해서\", \"answer2\": \"여행을 가기 위해서\", \"question\": \"돈은 왜 필요할까?\"}, {\"char\": \"dony_basic\", \"line\": \"네 말도 맞아! 돈이 있어야 생활에 필요한 물건을 사고, 하고 싶은 일을 하고, 아플 때 병원에 갈 수 있는 거야.\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_happy\", \"line\": \"오오, 이제 경제 전문가가 된 기분인데?\\n흠, 이제부터 내 돈은 내가 관리...\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_worried\", \"line\": \"잠깐~! 전문가가 되기에는 아직 한참 남았거든?!\\n벌써부터 돈 쓸 궁리만 하지 말고 더 부지런히 공부하자구!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_embrrassed\", \"line\": \"쳇...\", \"name\": \"todragon\", \"type\": \"line\"}], \"background\": \"bg_main\"}]',1),(2,'dialog2.json','[{\"id\": 5, \"dialogs\": [{\"char\": \"mom_basic\", \"line\": \"{이름}, 마트 가서 우유랑 달걀 좀 사다 줄래?\\n남은 돈으로 원하는 것도 사렴.\", \"name\": \"mom\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"네, 갔다올게요!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"line\": \"잠깐, 나도 같이 가! 심부름 하는 거 도와줄게!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_worried\", \"line\": \"나 참... 내가 애도 아니고 심부름도 못할까봐?\", \"name\": \"todragon\", \"type\": \"line\"}], \"background\": \"bg_home\"}, {\"id\": 6, \"dialogs\": [{\"char\": \"dony_surprised\", \"line\": \"*띠리링*\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"dony_surprised\", \"line\": \"앗, 갑자기 요정 나라에서 급한 연락이! {이름}, 먼저 가고 있어!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_worried\", \"line\": \"심부름 하는 거 봐준다고 큰소리 치더니만...\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"todragon_surprised\", \"line\": \"헉, 저건 요즘 제일 유행하는 캐치 카우팡의 카우보이 모자잖아!\\n나비가 엄청 자랑해서 부러웠는데...\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"streetbird_basic\", \"line\": \"오, 운이 좋은 걸! 지금 딱 한 개 남았거든!\", \"name\": \"streetbird\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"하, 한 개? 으음... 그래도 다음에 또 들어오겠죠...?\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"streetbird_basic\", \"line\": \"글쎄, 언제 다시 입고될 지는 모르겠구나. 워낙 인기가 많아서 물량이 많이 모자라거든.\", \"name\": \"streetbird\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"(지금 사지 않으면 영영 못 구할지도 몰라...\\n심부름 하려고 받은 돈이 조금 여유있긴 한데, 어쩌지?)\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"streetbird_basic\", \"name\": \"streetbird\", \"type\": \"question\", \"answer0\": \"구매한다\", \"question\": \"그래서, 모자를 사겠니?\", \"answerSkip1\": \"구매하지 않는다\"}, {\"char\": \"streetbird_basic\", \"line\": \"고맙다, 잘 쓰고 다니렴!\", \"name\": \"streetbird\", \"type\": \"line\"}, {\"nextId\": 7}, {\"char\": \"streetbird_basic\", \"line\": \"아쉽게 됐구나, 그럼 조심히 가렴!\", \"name\": \"streetbird\", \"type\": \"line\"}, {\"nextId\": 8}], \"background\": \"bg_main\"}, {\"id\": 7, \"dialogs\": [{\"char\": \"todragon_hat\", \"line\": \"헤헤, 모자 정말 맘에 든다. 사길 정말 잘 했어!!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_smile\", \"line\": \"{이름}, 나 왔어!!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_hat_worried\", \"line\": \"정말이지, 갑자기 가버리면 어떡해~\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"line\": \"헤헤 미안. 응? 그런데 그 모자는 갑자기 어디서 난 거야?\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_hat_embrrassed\", \"line\": \"그, 그냥 이 근처에서 받았어!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"todragon_hat\", \"line\": \"아참! 아저씨, 담은거 계산해주세요!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"manager_basic\", \"line\": \"다 해서 총 7000원 입니다.\", \"name\": \"mart_owner\", \"type\": \"line\"}, {\"char\": \"todragon_hat_surprised\", \"line\": \"7000원... 으앗, 돈이 부족하잖아?!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_surprised\", \"line\": \"왜 돈이 모자라?! 아까 엄마가 돈 여유있게 주시는 것 같..\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"dony_worried\", \"line\": \"너 설마.. 그 모자 심부름비로 산 거야..?\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_hat_worried\", \"line\": \"아니... 딱 한 개 남았다길래...\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_angry\", \"line\": \"으이구 내가 못 살아~!\\n내가 잠깐 자리 비운 사이에 돈을 다 써버리면 어떡해!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"dony_angry\", \"line\": \"안 되겠어, 지금 당장 현명한 소비 특훈이다!\", \"name\": \"dony\", \"type\": \"line\"}], \"background\": \"bg_mart\"}, {\"id\": 8, \"dialogs\": [{\"char\": \"dony_smile\", \"line\": \"{이름}, 나 왔어!!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_worried\", \"line\": \"정말이지, 갑자기 가버리면 어떡해~\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"line\": \"헤헤 미안. 얼른 계산하고 가자!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"아참! 아저씨, 담은거 계산해주세요!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"manager_basic\", \"line\": \"다 해서 총 7000원 입니다.\", \"name\": \"mart_owner\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"여기요!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"manager_basic\", \"line\": \"감사합니다. 또 오세요~!\", \"name\": \"mart_owner\", \"type\": \"line\"}, {\"char\": \"dony_smile\", \"line\": \"심부름도 순조롭게 잘 하네. 대견한걸!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_happy\", \"line\": \"히힛!\", \"name\": \"todragon\", \"type\": \"line\"}], \"background\": \"bg_mart\"}, {\"id\": 9, \"dialogs\": [{\"char\": \"todragon_worried\", \"line\": \"에휴...\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"line\": \"심부름도 잘 끝냈는데 웬 한숨이야?\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_worried\", \"line\": \"사실 아까 갖고 싶은 모자가 있었는데 심부름에 돈이 모자랄까봐 안 샀거든.\\n오는 길에 보니까 이미 팔렸는지 안 보이더라구...\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_surprised\", \"line\": \"뭣! 갖고 싶은 물건이 있었는데도 꾹 참았다고?!\\n이런 기특한 일을 하다니!!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_basic\", \"line\": \"하지만 그 모자는 더 이상 팔지 않을 수도 있댔어. 그냥 사버릴걸 그랬나?\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_basic\", \"line\": \"하지만 그랬다면 심부름비가 모자라서 정작 필요한 물건은 못 샀을 거야.\\n현명한 선택을 한 거라구!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_happy\", \"line\": \"하긴 그렇지? 나도 처음에는 아쉬웠지만 지금은 뿌듯해!\", \"name\": \"todragon\", \"type\": \"line\"}, {\"char\": \"dony_happy\", \"line\": \"좋아, 아주 좋은 마음가짐이야!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"dony_smile\", \"line\": \"그렇다면, 오늘 네가 한 똑똑한 소비에 대해 자세히 알아볼 차례겠지?!\", \"name\": \"dony\", \"type\": \"line\"}, {\"char\": \"todragon_worried\", \"line\": \"(자연스럽게 수업을 시작하네...)\", \"name\": \"todragon\", \"type\": \"line\"}], \"background\": \"bg_home\"}]',2);
/*!40000 ALTER TABLE `jsonFiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning`
--

DROP TABLE IF EXISTS `learning`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning` (
  `learning_id` int NOT NULL AUTO_INCREMENT COMMENT '러닝 ID',
  `curriculum_id` int NOT NULL COMMENT '커리큘럼 ID',
  `content` text NOT NULL COMMENT '학습 콘텐츠 내용',
  PRIMARY KEY (`learning_id`),
  KEY `curriculum_id` (`curriculum_id`),
  CONSTRAINT `learning_ibfk_1` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculum` (`curriculum_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning`
--

LOCK TABLES `learning` WRITE;
/*!40000 ALTER TABLE `learning` DISABLE KEYS */;
INSERT INTO `learning` VALUES (1,1,'돈이란 무엇일까?\n\n돈은 우리가 물건을 사고팔 때 사용하는 아주 편리한 도구예요. 다른 말로는 \'화폐\'라고 부르죠. \n예전에는 돈이 없어서 필요한 물건을 서로 바꾸는 물물교환을 했어요. \n\n하지만 이 방법에는 불편한 점이 많았어요. \n예를 들어, 내가 갖고 있는 물건이 상대방에게 필요하지 않으면 교환이 어려웠고, 음식처럼 상하는 물건은 오래 보관하기도 힘들었어요. \n또 무거운 물건을 들고 다니는 것도 쉽지 않았죠.\n\n그래서 사람들은 점점 더 편리한 방법을 찾았어요. \n처음엔 금이나 은처럼 가치 있는 금속을 돈처럼 사용했고, 이후엔 금속 화폐(동전)를 만들었어요. \n하지만 동전은 무겁고 불편했기 때문에, 나중에는 가볍고 쓰기 쉬운 종이돈이 생겼고, 요즘은 디지털 화폐로 휴대폰이나 컴퓨터를 이용해 돈을 주고받을 수 있어요.\n\n돈은 우리가 음식, 옷, 학용품을 사거나 병원에 가고, 여행을 떠날 때 꼭 필요해요. \n우리가 생활하는 데 없어서는 안 될 중요한 도구랍니다.'),(2,2,'소비와 돈 관리\n\n돈은 그냥 쓰는 것이 아니라 알맞게 관리하는 것이 중요해요. 필요한 물건을 사기 위해 돈을 쓰는 걸 \'소비\'라고 하고, 물건을 만들고, 팔고, 사는 모든 활동은 \'경제 활동\'이라고 해요. \n\n하지만 우리가 원하는 건 많아도, 쓸 수 있는 돈은 한정되어 있기 때문에 합리적인 소비가 필요해요. \n합리적으로 소비하려면 먼저 저축을 하고, 정말 필요한지 생각하고, 우선순위를 정해서 중요한 것부터 써야 해요. \n\n물건을 살 때는 정보를 미리 알아보는 것도 중요해요. 가족이나 친구에게 물어보거나, 인터넷 후기나 광고를 참고하고, 매장에서 직접 확인해보는 것도 좋아요. \n단, 광고는 항상 믿을 수 없고, 너무 오래 고민하면 결정을 못할 수도 있으니 주의해야 해요.\n\n지출 계획을 세우는 습관도 필요해요! 앞으로 쓸 돈을 미리 계획하면, 정말 필요한 곳에 돈을 쓸 수 있고 낭비도 막을 수 있어요. \n내가 가진 돈을 파악하고, 특별한 지출이 있는지 생각한 뒤, 저축할 돈, 쓸 돈, 여윳돈으로 나눠보는 것이 좋아요.'),(3,3,'용돈 관리와 저축\n\n용돈을 잘 관리하면 저축하고, 기부하고, 필요한 물건을 사는 좋은 경제 습관을 기를 수 있어요. \n그래서 우리는 용돈을 받은 뒤 어디에 썼는지 기록하는 습관을 들여야 해요. 그럴 때 사용하는 것이 바로 용돈 기입장이에요.\n\n용돈 기입장을 쓰면 돈이 어디로 나갔는지 쉽게 알 수 있고, 낭비를 줄이고, 계획적으로 소비하는 데 도움이 돼요. \n먼저 예산을 세우고, 받은 돈과 쓴 돈, 남은 돈을 기록한 뒤, 한 달이 지나면 어떻게 돈을 썼는지 다시 정리해보는 습관을 가져보세요.\n\n그리고 저축도 중요해요. 지금 돈을 아껴 쓰고 조금씩 모아두면, 나중에 필요한 물건을 살 수도 있고, 갑자기 돈이 필요할 때 사용할 수 있어요. \n또 나이가 들어 일을 못 하게 될 때를 대비할 수도 있겠죠?\n\n저축은 은행에 맡기면 더 안전하고 이자도 받을 수 있어요. \n예금은 언제든지 돈을 넣고 뺄 수 있어서 편하고, 적금은 정해진 기간 동안 조금씩 모아서 큰돈을 만들 수 있어요. 이자는 적금이 더 많지만, 꾸준히 모아야 해요.\n용돈을 잘 관리하고, 저축하는 습관을 들이면, 우리는 더욱 똑똑한 경제생활을 할 수 있어요!'),(4,4,'개인정보란?\n\n개인정보는 이름, 생년월일, 주소, 전화번호처럼 나를 알아볼 수 있는 정보예요. 이런 정보가 다른 사람에게 넘어가면 나쁜 일이 생길 수 있어요. 예를 들어, 누군가 내 이름과 전화번호를 알아내서 나인 척 물건을 사거나, 스팸 문자나 전화를 보내는 피해가 생길 수 있어요. 그래서 우리는 개인정보를 소중히 지키는 습관이 필요해요.\n\n요즘은 인터넷과 스마트폰을 많이 사용하면서 개인정보가 쉽게 노출될 수 있어요. SNS에 사진을 올릴 때 위치 정보가 들어가 있거나, 회원가입을 할 때 너무 많은 정보를 입력하면 위험할 수 있어요. 꼭 필요한 정보만 입력하고, 낯선 사이트에는 가입하지 않는 것이 좋아요.\n\n또한 비밀번호를 만들 때는 다른 사람이 쉽게 추측하지 못하도록 영어, 숫자, 특수문자를 섞어서 만들고, 정기적으로 바꾸는 것이 좋아요. 공공장소에서 컴퓨터를 사용할 땐 로그아웃을 꼭 해야 하고, 친구와 기기를 공유할 때에도 주의해야 해요.\n\n개인정보를 잘 지키면 온라인 활동도 안전하게 할 수 있어요. 작은 습관이지만, 이런 실천들이 모여서 내 정보를 지키는 큰 힘이 돼요. 우리가 디지털 세상에서 현명하게 살아가기 위해 꼭 필요한 약속이랍니다.'),(5,5,'신용과 부채 관리\n\n신용은 누군가가 나를 믿고 돈이나 물건을 먼저 주고, 나중에 갚을 수 있다고 생각하는 것이에요. 예를 들어, 신용카드를 사용할 때는 물건을 먼저 사고 나중에 카드사에 돈을 갚는 방식이죠. 이런 거래는 \'이 사람이라면 꼭 갚을 거야\'라는 믿음이 있어야 가능해요.\n\n이처럼 신용이 좋으면 급하게 돈이 필요할 때 쉽게 빌릴 수 있고, 중요한 물건이나 서비스를 먼저 사용할 수 있는 기회도 많아져요. 하지만 편리하다고 해서 계획 없이 돈을 쓰면 나중에 갚지 못해 문제가 생기기 쉬워요. 그래서 신용은 책임감 있는 소비와 깊은 관련이 있어요.\n\n신용과 관련된 개념으로 \'부채\'가 있어요. 부채는 빌린 돈을 의미하는데, 친구에게 1000원을 빌렸다면 그게 바로 부채예요. 부채가 많아질수록 갚기 어려워지고, 약속을 지키지 않으면 신용도 함께 떨어져요. 결국, 부채는 내 신용에 영향을 주는 중요한 요소예요.\n\n따라서 어릴 때부터 돈을 계획적으로 쓰고, 한 번 빌린 돈은 반드시 정해진 날에 갚는 습관을 기르는 것이 중요해요. 신용은 한 번 나빠지면 회복하는 데 오랜 시간과 노력이 들기 때문에, 평소에도 신중하고 책임 있는 태도가 필요하답니다.'),(6,6,'보험의 개념과 중요성\n\n보험은 우리가 예상하지 못한 사고나 질병 같은 위험에 대비하기 위해 만들어진 제도예요. 여러 사람이 조금씩 돈을 모아두고, 실제로 사고를 당한 사람에게 그 돈을 지원해주는 방식이에요. 이렇게 위험을 함께 나누면, 갑작스러운 문제도 훨씬 덜 걱정할 수 있답니다.\n\n예를 들어, 갑자기 아파서 병원에 가야 할 때 병원비가 많이 나올 수 있어요. 그런데 건강보험에 가입되어 있다면 큰돈이 들지 않고 치료를 받을 수 있어요. 자동차 사고나 집에 불이 났을 때도 자동차보험, 화재보험이 있으면 금전적인 피해를 줄일 수 있어요.\n\n하지만 보험은 아무거나 다 가입하는 것보다, 내 상황에 맞는 보험을 고르는 것이 중요해요. 너무 많은 보험에 들면 보험료만 많이 내고 실제로는 도움이 안 될 수도 있어요. 또 중간에 해지하면 돌려받는 돈이 적을 수 있어서 손해를 보는 경우도 있어요.\n\n그래서 보험에 가입할 때는 꼭 필요한 보험인지, 조건은 괜찮은지 잘 살펴봐야 해요. 보험은 나를 위한 안전망이기도 하지만, 계획 없이 가입하면 오히려 부담이 될 수도 있거든요. 올바른 보험 선택이 우리 삶을 더 든든하게 지켜줄 수 있답니다.'),(7,7,'시장과 가격 변동\n\n시장이란 사람들이 물건이나 서비스를 사고파는 장소예요. 우리가 자주 가는 마트나 편의점뿐만 아니라 인터넷 쇼핑몰도 모두 시장에 해당해요. 시장이 있기 때문에 우리는 필요한 물건을 구하고, 갖고 있는 물건을 팔 수 있어요.\n\n시장에서 물건의 가격은 항상 같은 것이 아니에요. 어떤 때는 비싸지고, 어떤 때는 싸지기도 하죠. 이런 가격의 변화는 \'수요와 공급\'이라는 원리에 따라 결정돼요. 사고 싶은 사람이 많아지면(수요 증가) 가격이 오르고, 팔려는 사람이 많아지면(공급 증가) 가격이 내려가는 거예요.\n\n예를 들어, 딸기가 제철일 땐 많이 생산돼서 가격이 저렴하지만, 겨울처럼 생산이 어려운 시기에는 가격이 비싸질 수 있어요. 또 날씨, 유행, 특별한 행사 같은 외부 요인도 가격에 영향을 줘요. 그래서 시장 가격은 늘 변하고, 우리는 그 안에서 현명하게 선택해야 해요.\n\n올바른 소비를 위해서는 가격을 비교하고, 물건이 정말 필요한지 따져보는 습관이 필요해요. 때로는 가격이 내려갈 때까지 기다리는 것도 좋은 소비 방법이에요. 시장의 원리를 이해하면, 우리는 똑똑하게 물건을 사고, 돈도 더 잘 아낄 수 있어요!'),(8,8,'투자란 무엇일까?\n\n투자란 내가 가진 돈을 그냥 가만히 두지 않고, 어떤 것에 사용해서 나중에 더 많은 돈이나 가치를 얻으려고 하는 활동이에요.\n예를 들어, 1000원짜리 장난감을 샀는데 시간이 지나서 2000원이 되면, 그 장난감을 팔아서 1000원을 더 벌 수 있어요.\n이처럼 돈이나 물건을 지금 쓰지 않고, 미래에 더 큰 이익을 바라보며 사용하는 것이 투자예요.\n사람들은 주식, 부동산, 물건, 창업 등 여러 가지에 투자할 수 있어요.\n하지만 투자에는 항상 돈을 잃을 위험도 있다는 걸 알아야 해요.\n\n투자와 저축은 둘 다 돈을 모으는 방법이지만, 방식이 달라요.\n저축은 은행에 돈을 맡기고 조금씩 이자를 받으면서 안전하게 돈을 모으는 거예요.\n투자는 주식이나 물건을 사서 그 가치가 오르길 기대하며 돈을 버는 방법이에요.\n저축은 돈을 잃을 일이 거의 없지만 이익이 적고, 투자는 이익이 클 수 있지만 위험도 커요.\n예를 들어, 저축은 돼지 저금통에 돈을 차곡차곡 모으는 것, 투자는 사과 씨앗을 심어 큰 사과를 기대하는 것과 비슷해요.\n\n우리가 투자를 하는 가장 큰 이유는 돈의 가치가 시간이 지나면서 변하기 때문이에요.\n예를 들어, 지금 천 원으로 아이스크림을 살 수 있지만, 몇 년 뒤에는 그 아이스크림이 1500원이 될 수도 있어요.\n이렇게 물건값이 오르는 것을 물가 상승, 또는 인플레이션이라고 해요.\n그냥 돈을 모아두기만 하면 나중에 그 돈으로 살 수 있는 게 줄어들 수 있어요.\n그래서 사람들은 저축이나 투자를 통해 돈의 가치를 지키고, 더 늘리려고 노력해요.\n\n투자는 무작정 남을 따라 하거나 아무렇게나 하면 안 돼요.\n돈을 벌 수도 있지만, 반대로 돈을 잃을 수도 있기 때문이에요.\n예를 들어, 친구가 \'이 장난감은 곧 인기가 많아질 거야!\'라고 해도, 실제로 인기가 없어지면 손해를 볼 수 있어요.\n그래서 투자를 할 때는 먼저 공부를 하고, 투자하려는 것이 어떤 성격인지, 얼마나 위험한지 잘 살펴봐야 해요.\n항상 내가 감당할 수 있는 만큼만 투자하고, 스스로 생각하고 계획하는 습관이 필요해요.'),(9,9,'나라의 돈과 가치변화란?\n\n물가란 우리가 사는 세상에서 여러 물건의 평균적인 가격을 말해요.\n예를 들어, 사탕, 연필, 공책, 옷 등 여러 물건의 가격이 모두 조금씩 오르면 우리는 물가가 올랐다고 해요.\n물가는 나라 안에 돈이 얼마나 많은지, 사람들이 얼마나 돈을 쓰는지에 따라 달라져요.\n사람들의 월급이 늘어나고, 돈을 많이 쓰면 물건값이 오르기도 해요.\n그래서 물가는 우리 생활에 아주 중요한 영향을 줘요.\n\n돈의 가치는 그 돈으로 얼마나 많은 물건이나 서비스를 살 수 있는지를 의미해요.\n지금은 천 원으로 연필 두 자루를 살 수 있지만, 몇 년 뒤에는 한 자루밖에 못 살 수도 있어요.\n같은 돈이지만 살 수 있는 양이 줄어드는 건, 돈의 가치가 떨어졌다는 뜻이에요.\n시간이 지나면서 돈의 가치는 바뀔 수 있기 때문에, 사람들은 저축이나 투자를 하기도 해요.\n돈을 그냥 가지고만 있지 말고, 똑똑하게 써야 가치가 줄어들지 않아요.\n\nGDP는 \'국내총생산\'이라는 말의 줄임말로, 한 나라에서 일정 기간 동안 생산된 모든 물건과 서비스의 값을 더한 것을 말해요.\n예를 들어, 한국에서 1년 동안 만들어진 자동차, 빵, 휴대폰, 영화, 병원 진료 등 모든 것을 돈으로 계산해서 합친 값이 바로 GDP예요.\nGDP가 높을수록 나라가 활발하게 경제 활동을 하고 있다는 뜻이에요.\nGDP가 높으면 사람들의 소득도 높아지고, 생활도 더 풍요로워질 수 있어요.\n하지만 GDP만으로는 국민들이 얼마나 행복한지, 환경이 얼마나 깨끗한지는 알 수 없어요.\n\n환율은 우리나라 돈과 다른 나라 돈을 바꾸는 비율이에요.\n예를 들어 미국 돈 1달러가 1300원이라면, 1달러를 사기 위해 우리는 1300원을 내야 해요.\n환율이 올라가면 우리나라 돈의 가치가 떨어졌다는 뜻이고, 환율이 내려가면 우리나라 돈의 가치가 올라갔다는 뜻이에요.\n환율이 높아지면 외국에서 물건을 사오는 데 더 많은 돈이 필요해서 수입 물건 값이 오를 수 있어요.\n그래서 환율은 경제 뉴스에서도 자주 나오는 중요한 숫자예요.'),(10,10,'기부와 나눔의 중요성\n\n기부는 내가 가진 돈이나 물건을 어려운 사람이나 단체에 대가 없이 주는 것을 말해요.\n나눔은 기부보다 더 넓은 의미로, 돈이나 물건뿐 아니라 내 시간, 마음, 정성도 함께 나누는 행동이에요.\n예를 들어 다 읽은 책을 도서관에 기부하거나, 친구와 우산을 함께 쓰는 것도 나눔이에요.\n꼭 돈이 많지 않아도, 따뜻한 말 한마디나 작은 배려도 훌륭한 나눔이 될 수 있어요.\n\n기부와 나눔은 세상을 더 따뜻하게 만들어요.\n도움이 필요한 사람에게 큰 힘이 될 수 있고,\n기부와 나눔을 하면 나 자신도 마음이 뿌듯하고 행복해져요.\n이런 작은 행동들이 모이면 우리 사회 전체가 더 살기 좋아져요.\n나 혼자만 잘 사는 게 아니라, 함께 잘 살아가는 세상이 되는 거예요.\n\n우리는 모두 함께 살아가는 세상에 살고 있어요.\n어떤 날은 내가 남을 도울 수 있지만, 어떤 날은 내가 다른 사람의 도움을 받아야 할 수도 있어요.\n기부와 나눔은 서로를 이해하고 도와주는 마음을 키우게 해줘요.\n이런 마음을 어릴 때부터 배우고 실천하다 보면,\n나중에 어른이 돼서도 따뜻한 마음으로 세상을 살아갈 수 있어요.');
/*!40000 ALTER TABLE `learning` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_progress`
--

DROP TABLE IF EXISTS `learning_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning_progress` (
  `learning_progress_id` int NOT NULL AUTO_INCREMENT COMMENT '학습 진행 ID',
  `learning_id` int NOT NULL COMMENT '러닝 ID',
  `user_character_id` int NOT NULL COMMENT '유저 캐릭터 ID',
  `learning_pass` tinyint(1) NOT NULL DEFAULT '0' COMMENT '학습 통과 여부',
  PRIMARY KEY (`learning_progress_id`),
  KEY `learning_id` (`learning_id`),
  KEY `user_character_id` (`user_character_id`),
  CONSTRAINT `learning_progress_ibfk_1` FOREIGN KEY (`learning_id`) REFERENCES `learning` (`learning_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `learning_progress_ibfk_2` FOREIGN KEY (`user_character_id`) REFERENCES `user_characters` (`user_character_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_progress`
--

LOCK TABLES `learning_progress` WRITE;
/*!40000 ALTER TABLE `learning_progress` DISABLE KEYS */;
INSERT INTO `learning_progress` VALUES (1,1,1,1),(2,2,1,1),(3,3,1,1),(4,6,1,1),(5,4,1,1),(6,9,1,1),(7,7,1,1),(8,5,1,1),(9,8,1,1),(10,1,3,1),(11,4,3,1),(12,2,3,1),(13,5,3,1),(14,1,4,1),(15,2,4,1),(16,10,1,1),(17,1,6,1),(18,2,6,1);
/*!40000 ALTER TABLE `learning_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `quiz_id` int NOT NULL AUTO_INCREMENT COMMENT '퀴즈 ID',
  `question` varchar(255) NOT NULL COMMENT '퀴즈 제목',
  `answer` int NOT NULL COMMENT '퀴즈 답',
  `solution` varchar(255) DEFAULT NULL COMMENT '해설',
  `curriculum_id` int NOT NULL COMMENT '커리큘럼id(외래키)',
  PRIMARY KEY (`quiz_id`),
  UNIQUE KEY `quiz_id` (`quiz_id`),
  KEY `curriculum_id` (`curriculum_id`),
  CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculum` (`curriculum_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (1,'우리는 왜 돈을 사용할까요?',3,'돈으로는 원하는 물건을 구매할 수 있습니다.',1),(2,'다음 중 돈의 가장 중요한 역할은 무엇일까요?',2,'돈으로는 생활에 필요한 물건들을 구매할 수 있습니다.',1),(3,'처음에는 사람들이 무얼 활용해서 물건을 구매했나요?',3,'처음에는 물물교환을 활용했어요.',1),(4,'금속 화폐를 사용하다가 나온 대안이 무엇일까요?',3,'금속 화폐 다음으로 나온 건 지폐예요.',1),(5,'다음 중 돈의 특징이 아닌 것은?',3,'최근에는 물물교환을 많이 활용하지 않습니다.',1),(6,'우리나라의 돈 이름은?',4,'우리나라는 “원화”를 사용합니다.',1),(7,'금속을 화폐로 사용할 경우 발생하는 문제점으로 옳지 않은 것은?',2,'금속은 잘 손상되지 않아 곡식을 대신해 사용됐어요.',1),(8,'곡식과 소금을 화폐로 사용하는 건 어떤 점 때문에 불편했을까요?',3,'곡식과 소금은 쉽게 상할 수 있어요.',1),(9,'돈으로 할 수 없는 것은?',3,'돈이 있다고 친구에게 심부름을 시키면 안 돼요!',1),(10,'지금 사용하는 돈이 생기기 전을 설명한 것으로 틀린 것은?',3,'돈이 생기기 전에도 다양한 방법으로 물건을 구매할 수 있었어요.',1),(11,'소비란 무엇인가요?',3,'소비는 필요한 물건을 사기 위해 돈을 쓰는 것입니다.',2),(12,'꼭 필요한 것만 사는 것을 뭐라고 하나요?',2,'합리적 소비는 꼭 필요한 것에 돈을 쓰는 것입니다.',2),(13,'다음 중 충동 소비는?',3,'세일을 한다는 이유로 물건을 구매하면 충동 소비예요.',2),(14,'소비 계획을 세우는 것은 왜 중요할까요?',3,'계획 없이 쓰면 돈을 아낄 수 없기 때문입니다.',2),(15,'소비를 잘하는 방법은?',2,'계획을 세우고 꼭 필요한 것에만 돈을 쓰는 것이 좋습니다.',2),(16,'광고를 볼 때 우리는 어떻게 해야 하나요?',3,'광고를 볼 때는 비교하고 판단하는 것이 중요합니다.',2),(17,'다음 중 소비에 해당하지 않는 것은?',3,'저금하기는 소비가 아니라 저축입니다.',2),(18,'합리적인 소비란?',2,'합리적인 소비는 꼭 필요한 것만 사는 것입니다.',2),(19,'돈을 다 쓰고 후회하는 소비는?',2,'충동 소비는 후회하게 될 수 있습니다.',2),(20,'소비를 결정할 때 무엇을 고려해야 하나요?',2,'필요한지 생각하고 우선순위를 정해야 합니다.',2),(21,'저축이란 무엇인가요?',2,'저축은 미래를 위해 돈을 모으는 것입니다.',3),(22,'저축이 필요한 이유는?',1,'갑자기 돈이 필요할 수 있기 때문입니다.',3),(23,'저축을 잘하는 방법은?',2,'저축 목표를 세우고 실천하면 잘 할 수 있습니다.',3),(24,'저축통장은 어디서 만들 수 있을까요?',2,'은행에서 저축통장을 만들 수 있어요.',3),(25,'저축한 돈은 어디에 보관하나요?',3,'은행에 보관하면 안전합니다.',3),(26,'저축을 하면 좋은 점은?',3,'미래를 준비할 수 있습니다.',3),(27,'저축이 어려운 이유는?',2,'사고 싶은 물건이 있어도 참아야 해요.',3),(28,'저축 목표가 있으면?',3,'돈을 계획적으로 모을 수 있습니다.',3),(29,'저축은 언제 시작해야 좋나요?',2,'빠르게 저축 습관을 기르는게 좋아요.',3),(30,'어떤 저축 습관이 좋을까요?',2,'꼭 필요한 돈을 계산해서 체계적으로 저축해요.',3),(31,'다음 중 일반적으로 개인정보로 간주되지 않는 정보는 무엇인가요?',3,'좋아하는 음식은 개인을 특정할 수 없어 개인정보가 아닙니다.',4),(32,'개인정보를 보호해야 하는 주된 이유는 무엇인가요?',2,'개인정보 유출은 금융사기나 사생활 침해로 이어질 수 있기 때문입니다.',4),(33,'다음 중 개인정보 유출로 인해 직접적으로 발생할 수 있는 문제는?',1,'스팸 문자와 같은 불필요한 연락은 개인정보 유출의 대표적인 예입니다.',4),(34,'다음 중 개인정보 보호 수칙으로 적절한 행동은 무엇인가요?',1,'비밀번호는 개인만 알고 있어야 안전합니다.',4),(35,'금융거래에서 개인정보가 필요한 주된 이유는?',2,'본인 여부를 확인하기 위해서입니다.',4),(36,'스미싱 사기의 특징은 무엇인가요?',3,'스미싱은 문자로 링크를 보내 개인 정보를 탈취하는 범죄입니다.',4),(37,'다음 중 개인정보로 가장 적절한 예시는?',1,'이름은 대표적인 개인정보입니다.',4),(38,'개인정보 보호를 위해 피해야 할 행동은 무엇인가요?',4,'모르는 링크를 클릭하는 것은 매우 위험한 행동입니다.',4),(39,'다음 중 개인정보 보호를 위한 행동으로 바람직한 것은?',2,'모르는 링크를 클릭하지 않는 것이 중요합니다.',4),(40,'개인정보 유출 방지를 위한 수칙이 아닌 것은?',3,'광고 클릭은 개인정보 보호와는 관련이 없습니다.',4),(41,'신용이 높은 사람은 어떤 경우에 해당하나요?',2,'신용이 높다는 것은 돈을 빌리고 잘 갚는다는 의미입니다.',5),(42,'다음 중 부채라고 볼 수 있는 상황은?',3,'부채란 갚아야 할 돈이 있는 상태를 말합니다.',5),(43,'신용카드를 사용할 때 조심해야 할 점은?',1,'신용카드는 나중에 갚는 것이기 때문에 과소비 위험이 있습니다.',5),(44,'신용이 낮아지면 어떤 문제가 생길 수 있나요?',4,'신용이 낮으면 돈을 빌릴 수 있는 기회가 줄어듭니다.',5),(45,'다음 중 신용을 지키는 행동으로 알맞은 것은?',1,'빌린 돈을 제때 갚는 것이 신용을 지키는 방법입니다.',5),(46,'부채를 너무 많이 지게 되면 생길 수 있는 일은?',2,'부채가 많으면 생활이 어려워지고 신용도 나빠질 수 있습니다.',5),(47,'다음 중 부채에 해당하지 않는 것은?',3,'저축은 내가 가진 돈이므로 부채가 아닙니다.',5),(48,'신용등급이 높은 사람의 공통적인 특징은?',4,'약속을 잘 지키고 돈을 성실하게 갚는 사람이 신용이 높습니다.',5),(49,'신용은 왜 중요한가요?',2,'신용이 높으면 필요한 상황에서 돈을 빌릴 수 있습니다.',5),(50,'부채를 관리하는 올바른 방법은?',1,'부채는 사용한 만큼 갚는 습관을 들여야 합니다.',5),(51,'보험은 어떤 상황을 대비하기 위해 가입하나요?',2,'보험은 아플 때나 사고가 났을 때를 대비해 가입합니다.',6),(52,'다음 중 보험이 필요한 이유로 적절한 것은?',3,'예상치 못한 위험으로부터 나를 보호하기 위해 보험이 필요합니다.',6),(53,'보험에 가입하면 어떤 점이 좋은가요?',1,'보험에 가입하면 위험한 일이 생겼을 때 도움을 받을 수 있습니다.',6),(54,'다음 중 보험과 관련이 없는 것은?',4,'음악 감상은 보험과 관련이 없습니다.',6),(55,'보험료를 내는 이유는?',2,'보험료는 위험이 발생했을 때 도움을 받기 위해 미리 내는 비용입니다.',6),(56,'보험을 들면 어떤 사람들에게도 도움이 될까요?',3,'누구나 예기치 못한 위험을 겪을 수 있으므로 모든 사람에게 도움이 됩니다.',6),(57,'다음 중 보험이 가장 필요할 수 있는 상황은? ',4,'갑작스러운 사고나 병원비가 많이 드는 상황에 보험이 필요합니다.',6),(58,'보험이 없다면 어떤 문제가 생길 수 있을까요?',1,'보험이 없으면 위험 상황에서 많은 비용을 감당해야 할 수 있습니다.',6),(59,'보험에 대한 설명으로 알맞은 것은?',2,'보험은 위험에 대비해 미리 준비하는 방법입니다.',6),(60,'다음 중 보험을 잘 활용하는 태도는?',1,'보험이 왜 필요한지 알고 스스로 가입을 고려하는 것이 바람직합니다.',6),(61,'시장이란 어떤 곳인가요?',1,'시장은 사람들이 물건을 사고파는 장소를 말합니다.',7),(62,'시장에서는 어떤 일이 일어나나요?',2,'시장에서는 사람들이 필요한 것을 사고, 가진 물건을 팝니다.',7),(63,'다음 중 시장의 기능으로 적절한 것은?',4,'시장에서는 원하는 물건을 사고 필요한 정보를 얻을 수 있습니다.',7),(64,'물건의 가격이 오르면 어떤 일이 생길 수 있나요?',2,'가격이 오르면 사람들이 그 물건을 덜 사게 됩니다.',7),(65,'가격이 내려가면 보통 어떤 일이 일어나나요?',1,'가격이 내려가면 사람들이 그 물건을 더 많이 사려고 합니다.',7),(66,'수요란 무엇을 의미하나요?',3,'수요는 사람들이 어떤 물건을 사고 싶어 하는 양을 말합니다.',7),(67,'공급이 많아지면 가격은 어떻게 될 가능성이 있나요?',2,'공급이 많아지면 경쟁이 심해져 가격이 내려갈 수 있습니다.',7),(68,'수요가 줄어들면 판매자는 어떻게 행동할 수 있나요?',4,'수요가 줄면 더 많은 구매를 유도하기 위해 가격을 낮추는 경우가 많습니다.',7),(69,'수요와 공급이 만나서 결정되는 것은?',1,'수요와 공급이 만나서 물건의 가격이 결정됩니다.',7),(70,'시장에 대한 설명으로 옳은 것은?',3,'시장은 사람들 사이에서 물건과 돈이 오가는 장소입니다.',7),(71,'투자를 할 때 가장 중요한 것은 무엇일까요?',2,'투자는 이익도 있지만 위험도 있으니, 잘 알아보고 결정하는 것이 중요하다.',8),(72,'다음 중 투자의 예가 아닌 것은 무엇일까요?',4,'투자는 미래에 이익을 기대하는 것이지만, 아이스크림을 사서 바로 먹는 것은 투자가 아니다.',8),(73,'투자와 저축의 공통점은 무엇일까요?',1,'둘 다 돈을 나중을 위해 모으는 방법이다.',8),(74,'저축과 투자의 차이로 맞는 것은?',3,'저축은 안전하지만 이익이 적고, 투자는 이익이 크지만 위험이 있는 것이다.',8),(75,'만약 친구가 “이 장난감은 곧 인기가 많아진대!”라고 하면, 어떻게 해야 할까요?',1,'다른 사람이 말해도 내가 직접 알아보고 결정하는 것이 중요하다.',8),(76,'투자를 할 때 위험을 줄이는 방법은?',2,'감당할 수 있는 만큼만 투자하고, 공부하는 것이 중요하다.',8),(77,'투자에서 “이익이 크다”는 말의 뜻은?',3,'투자는 잘하면 돈이 많이 늘어날 수 있다는 뜻이다.',8),(78,'투자를 하면 항상 돈을 벌 수 있을까요?',4,'투자는 돈을 잃을 수도 있으니 조심해야 한다.',8),(79,'다음 중 투자를 할 때 피해야 할 행동은?',1,'아무 생각 없이 남을 따라하면 위험하다.',8),(80,'투자를 하는 가장 큰 이유는 무엇인가요?',2,'돈의 가치는 시간이 지나면 변하기 때문이다.',8),(81,'물가가 오르면 어떤 일이 생길까요?',3,'같은 돈으로 살 수 있는 물건이 줄어드는 것이다.',9),(82,'GDP가 높다는 것은 어떤 뜻일까요?',2,'GDP가 높으면 나라가 활발하게 경제 활동을 한다는 뜻이다.',9),(83,'돈의 가치가 떨어지면 어떤 일이 생기나요?',1,'같은 돈으로 살 수 있는 물건이 줄어드는 것이다.',9),(84,'다음 중 물가에 영향을 주는 것은?',4,'사람들이 돈을 많이 쓰면 물가가 오를 수 있는 것이다.',9),(85,'환율이란 무엇인가요?',2,'환율은 우리나라 돈과 다른 나라 돈을 바꾸는 비율이다.',9),(86,'GDP만으로는 알 수 없는 것은?',3,'GDP만으로는 국민의 행복이나 환경 상태는 알 수 없는 것이다.',9),(87,'다음 중 돈의 가치를 지키는 방법은?',4,'저축이나 투자를 통해 돈의 가치를 지킬 수 있는 것이다.',9),(88,'환율이 올라가면 어떤 일이 생길까요?',2,'외국에서 물건을 사오는 데 더 많은 돈이 필요해지는 것이다.',9),(89,'다음 중 물가가 오르는 경우는?',1,'사탕, 연필, 옷 등 여러 물건의 가격이 모두 오를 때 물가가 오르는 것이다.',9),(90,'돈의 가치가 바뀔 때, 왜 똑똑하게 써야 할까요?',3,'돈의 가치가 변하니까 똑똑하게 써야 손해를 줄일 수 있는 것이다.',9),(91,'기부란 무엇일까요?',1,'기부는 내가 가진 돈이나 물건을 어려운 사람에게 주는 것이다.',10),(92,'나눔이란 무엇일까요?',4,'나눔은 돈, 물건, 마음, 시간 등 여러 가지를 함께 나누는 것이다.',10),(93,'기부와 나눔의 장점은 무엇인가요?',2,'기부와 나눔은 세상을 더 따뜻하게 만드는 것이다.',10),(94,'기부와 나눔을 하면 나에게 어떤 변화가 생기나요?',3,'마음이 뿌듯하고 행복해지는 것이다.',10),(95,'다음 중 나눔의 예로 알맞은 것은?',2,'친구와 우산을 함께 쓰는 것도 나눔이다.',10),(96,'기부를 꼭 돈으로만 해야 할까요?',3,'기부는 물건이나 시간, 정성으로도 할 수 있는 것이다.',10),(97,'기부와 나눔이 왜 중요할까요?',1,'서로 도우며 살아가는 따뜻한 사회가 되기 때문이다.',10),(98,'기부와 나눔을 하면 우리 사회에 어떤 변화가 생길까요?',2,'모두가 함께 잘 사는 사회가 되는 것이다.',10),(99,'기부와 나눔을 어릴 때부터 실천하면 좋은 점은?',4,'따뜻한 마음을 가진 어른이 될 수 있는 것이다.',10),(100,'기부와 나눔을 시작하는 가장 좋은 방법은?',2,'내가 할 수 있는 작은 것부터 시작해보는 것이 좋다.',10);
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_option`
--

DROP TABLE IF EXISTS `quiz_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_option` (
  `quiz_option_id` int NOT NULL AUTO_INCREMENT COMMENT '퀴즈 선택지 ID',
  `quiz_id` int NOT NULL COMMENT '퀴즈 id(외래키)',
  `quiz_option_index` int NOT NULL COMMENT '퀴즈 선택지 번호',
  `quiz_option_content` varchar(255) NOT NULL COMMENT '퀴즈 선택지의 텍스트',
  PRIMARY KEY (`quiz_option_id`),
  UNIQUE KEY `quiz_option_id` (`quiz_option_id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `quiz_option_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=401 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_option`
--

LOCK TABLES `quiz_option` WRITE;
/*!40000 ALTER TABLE `quiz_option` DISABLE KEYS */;
INSERT INTO `quiz_option` VALUES (1,1,1,'그림이 예뻐서'),(2,1,2,'무거워서'),(3,1,3,'원하는 물건을 구매하기 위해'),(4,1,4,'기분이 좋아서'),(5,2,1,'여행갈 때 쓰기'),(6,2,2,'생필품 구매하기'),(7,2,3,'친구에게 빌려주기'),(8,2,4,'신상 장난감 구매'),(9,3,1,'카드'),(10,3,2,'돈'),(11,3,3,'물건'),(12,3,4,'금'),(13,4,1,'곡식'),(14,4,2,'소금'),(15,4,3,'지폐'),(16,4,4,'인터넷 결제'),(17,5,1,'편리하다'),(18,5,2,'여러 형태로 변해왔다'),(19,5,3,'최근에는 물물교환을 많이 활용한다'),(20,5,4,'원하는 물건을 살 수 있다'),(21,6,1,'엔화'),(22,6,2,'달러'),(23,6,3,'유로'),(24,6,4,'원화'),(25,7,1,'옮기기 힘들다'),(26,7,2,'손상되기 쉽다'),(27,7,3,'저울이 필요하다'),(28,7,4,'무겁다'),(29,8,1,'배고프면 먹고 싶어져서'),(30,8,2,'잃어버리기 쉬워서'),(31,8,3,'쉽게 상할 수 있어서'),(32,8,4,'소금을 만드는 게 힘들어서'),(33,9,1,'새로 나온 장난감 사기'),(34,9,2,'저금하기'),(35,9,3,'친구에게 심부름 시키기'),(36,9,4,'기부하기'),(37,10,1,'무거운 곡식이나 금속들을 옮겨야 했다'),(38,10,2,'서로 필요한 물건끼리 교환했다'),(39,10,3,'필요한 물건을 구하지 못했다'),(40,10,4,'단점을 보완하며 화폐의 형태를 바꿨다'),(41,11,1,'돈을 저장하는 것'),(42,11,2,'돈을 버리는 것'),(43,11,3,'돈을 쓰는 것'),(44,11,4,'돈을 세는 것'),(45,12,1,'낭비 소비'),(46,12,2,'합리적 소비'),(47,12,3,'무계획 소비'),(48,12,4,'기분 소비'),(49,13,1,'계획한 장난감 구매'),(50,13,2,'심부름'),(51,13,3,'세일 상품 구매'),(52,13,4,'준비물 구매'),(53,14,1,'심심하니까'),(54,14,2,'친구가 하니까'),(55,14,3,'돈을 아끼기 위해'),(56,14,4,'엄마가 시켜서'),(57,15,1,'필요 없는 것도 산다'),(58,15,2,'계획을 세운다'),(59,15,3,'무조건 산다'),(60,15,4,'돈을 안 쓴다'),(61,16,1,'무조건 믿는다'),(62,16,2,'광고만 본다'),(63,16,3,'비교하고 판단한다'),(64,16,4,'아무 생각 없이 산다'),(65,17,1,'책 사기'),(66,17,2,'과자 먹기'),(67,17,3,'저금하기'),(68,17,4,'옷 사기'),(69,18,1,'싼 걸 많이 사기'),(70,18,2,'꼭 필요한 것만 사기'),(71,18,3,'광고 보고 사기'),(72,18,4,'친구 따라 사기'),(73,19,1,'절약 소비'),(74,19,2,'충동 소비'),(75,19,3,'합리적 소비'),(76,19,4,'기부 소비'),(77,20,1,'광고만 보기'),(78,20,2,'필요한지 생각하기'),(79,20,3,'친구 따라 하기'),(80,20,4,'색깔 예쁜 것 고르기'),(81,21,1,'돈을 모두 써버리는 것'),(82,21,2,'돈을 모으는 것'),(83,21,3,'돈을 숨기는 것'),(84,21,4,'돈을 빌리는 것'),(85,22,1,'갑자기 돈이 필요할 수 있기 때문'),(86,22,2,'돈을 쓸 곳이 없어서'),(87,22,3,'돈이 많으면 불편해서'),(88,22,4,'친구가 저축하니까'),(89,23,1,'필요 없는 것도 사기'),(90,23,2,'목표를 세우기'),(91,23,3,'계속 쓰기'),(92,23,4,'친구의 말을 믿기'),(93,24,1,'마트'),(94,24,2,'은행'),(95,24,3,'학교'),(96,24,4,'도서관'),(97,25,1,'지갑'),(98,25,2,'책상'),(99,25,3,'은행'),(100,25,4,'바닥 밑'),(101,26,1,'돈이 줄어든다'),(102,26,2,'돈을 못 쓴다'),(103,26,3,'미래를 준비할 수 있다'),(104,26,4,'무조건 산다'),(105,27,1,'돈이 많아서'),(106,27,2,'아껴 써야 해서'),(107,27,3,'은행이 없어서'),(108,27,4,'저금통이 없어서'),(109,28,1,'피곤해진다'),(110,28,2,'돈을 다 쓴다'),(111,28,3,'계획적으로 모은다'),(112,28,4,'맛있는 걸 몽땅 사 먹는다'),(113,29,1,'크고 나서'),(114,29,2,'지금 바로'),(115,29,3,'최대한 늦게'),(116,29,4,'돈이 많을 때'),(117,30,1,'필요할 때만 모은다'),(118,30,2,'계획에 따라 모은다'),(119,30,3,'모든 돈을 저축한다'),(120,30,4,'남들 따라 한다'),(121,31,1,'이름'),(122,31,2,'생년월일'),(123,31,3,'좋아하는 음식'),(124,31,4,'전화번호'),(125,32,1,'더 많은 광고를 보기 위해'),(126,32,2,'금융사기 피해를 막기 위해'),(127,32,3,'친구를 사귀기 위해'),(128,32,4,'이름을 바꾸기 위해'),(129,33,1,'스팸 문자 수신'),(130,33,2,'학교 점수 하락'),(131,33,3,'기분 변화'),(132,33,4,'친구와 말다툼'),(133,34,1,'비밀번호를 비공개로 유지'),(134,34,2,'모르는 링크 클릭'),(135,34,3,'사진을 자유롭게 공유'),(136,34,4,'생일을 모두에게 공개'),(137,35,1,'광고 목적'),(138,35,2,'본인 인증'),(139,35,3,'친구 찾기'),(140,35,4,'이름 변경'),(141,36,1,'음악 추천'),(142,36,2,'친구 초대'),(143,36,3,'문자 통한 정보 탈취'),(144,36,4,'운동 기록 공유'),(145,37,1,'이름'),(146,37,2,'좋아하는 색상'),(147,37,3,'즐겨 듣는 음악'),(148,37,4,'점심 메뉴'),(149,38,1,'비밀번호 변경'),(150,38,2,'주소 비공개'),(151,38,3,'생일 숨기기'),(152,38,4,'낯선 링크 클릭'),(153,39,1,'비밀번호 친구에게 공유'),(154,39,2,'링크 클릭 주의'),(155,39,3,'사진 자유 업로드'),(156,39,4,'생일 모두 공개'),(157,40,1,'비밀번호 공유 금지'),(158,40,2,'주소 비공개'),(159,40,3,'광고 링크 클릭'),(160,40,4,'낯선 문자 조심'),(161,41,1,'돈을 안 빌리는 사람'),(162,41,2,'빌린 돈을 제때 갚는 사람'),(163,41,3,'항상 현금만 쓰는 사람'),(164,41,4,'지출이 많은 사람'),(165,42,1,'용돈을 받음'),(166,42,2,'은행에 돈을 넣음'),(167,42,3,'친구에게 돈을 빌림'),(168,42,4,'장난감을 삼'),(169,43,1,'지나치게 많이 쓰지 않도록 하기'),(170,43,2,'현금만 쓰기'),(171,43,3,'신용카드는 전혀 쓰지 않기'),(172,43,4,'신용카드는 항상 무료'),(173,44,1,'돈을 더 많이 받는다'),(174,44,2,'저축이 늘어난다'),(175,44,3,'신용카드가 생긴다'),(176,44,4,'돈을 빌리기 어려워진다'),(177,45,1,'약속한 날짜에 돈을 갚는다'),(178,45,2,'갚지 않고 모른 척한다'),(179,45,3,'용돈을 모두 쓴다'),(180,45,4,'돈을 빌리고 연락을 끊는다'),(181,46,1,'용돈이 는다'),(182,46,2,'생활이 어려워진다'),(183,46,3,'친구가 많아진다'),(184,46,4,'돈을 안 써도 된다'),(185,47,1,'카드값'),(186,47,2,'대출금'),(187,47,3,'저축한 돈'),(188,47,4,'미지급 금액'),(189,48,1,'쇼핑을 자주 한다'),(190,48,2,'돈을 빌리면 연락을 피한다'),(191,48,3,'지출이 크다'),(192,48,4,'약속대로 돈을 갚는다'),(193,49,1,'돈을 많이 벌기 위해'),(194,49,2,'필요할 때 돈을 빌릴 수 있어서'),(195,49,3,'친구를 사귀기 위해'),(196,49,4,'공부를 잘하기 위해'),(197,50,1,'빌린 만큼 갚는 습관 갖기'),(198,50,2,'계속 미루기'),(199,50,3,'친구에게 대신 갚게 하기'),(200,50,4,'전혀 갚지 않기'),(201,51,1,'쇼핑을 하기 위해'),(202,51,2,'사고나 질병에 대비하기 위해'),(203,51,3,'여행을 위해'),(204,51,4,'용돈을 더 받기 위해'),(205,52,1,'친구를 사귀기 위해'),(206,52,2,'용돈을 모으기 위해'),(207,52,3,'갑작스러운 사고에 대비하기 위해'),(208,52,4,'쇼핑을 위해'),(209,53,1,'위험한 일이 생겼을 때 도움을 받을 수 있다'),(210,53,2,'돈을 벌 수 있다'),(211,53,3,'용돈이 는다'),(212,53,4,'게임 아이템을 살 수 있다'),(213,54,1,'자동차 사고'),(214,54,2,'병원 진료'),(215,54,3,'화재'),(216,54,4,'음악 감상'),(217,55,1,'부자가 되기 위해'),(218,55,2,'위험이 생겼을 때 보상을 받기 위해'),(219,55,3,'친구 따라하기 위해'),(220,55,4,'가족이 시켜서'),(221,56,1,'운동선수'),(222,56,2,'부자'),(223,56,3,'모든 사람'),(224,56,4,'어른만'),(225,57,1,'친구와 놀이'),(226,57,2,'쇼핑하기'),(227,57,3,'게임하기'),(228,57,4,'입원하거나 다쳤을 때'),(229,58,1,'비용 부담이 커질 수 있다'),(230,58,2,'친구가 줄어든다'),(231,58,3,'돈을 더 모을 수 있다'),(232,58,4,'게임 시간이 줄어든다'),(233,59,1,'보험은 돈 버는 방법이다'),(234,59,2,'보험은 위험을 대비하기 위한 것이다'),(235,59,3,'보험은 친구를 위한 것이다'),(236,59,4,'보험은 게임처럼 즐기는 것이다'),(237,60,1,'필요한 이유를 알고 활용한다'),(238,60,2,'친구가 하니까 따라한다'),(239,60,3,'광고를 보고 무조건 가입한다'),(240,60,4,'아무 보험이나 다 가입한다'),(241,61,1,'물건을 사고파는 곳'),(242,61,2,'공부를 하는 곳'),(243,61,3,'책을 빌리는 곳'),(244,61,4,'운동을 하는 곳'),(245,62,1,'운동을 한다'),(246,62,2,'물건을 사고판다'),(247,62,3,'영화를 본다'),(248,62,4,'숙제를 한다'),(249,63,1,'책을 읽는다'),(250,63,2,'게임을 한다'),(251,63,3,'운동을 배운다'),(252,63,4,'필요한 물건을 사고팔 수 있다'),(253,64,1,'더 많이 산다'),(254,64,2,'덜 사게 된다'),(255,64,3,'인기가 늘어난다'),(256,64,4,'사람들이 줄을 선다'),(257,65,1,'더 많이 사려 한다'),(258,65,2,'아무도 관심 없다'),(259,65,3,'가격이 더 오른다'),(260,65,4,'그 물건을 안 팔게 된다'),(261,66,1,'물건의 무게'),(262,66,2,'판매하는 가게 수'),(263,66,3,'사고 싶어 하는 양'),(264,66,4,'광고 횟수'),(265,67,1,'가격이 오른다'),(266,67,2,'가격이 내려간다'),(267,67,3,'가격이 유지된다'),(268,67,4,'판매가 중단된다'),(269,68,1,'광고를 줄인다'),(270,68,2,'더 많은 생산을 한다'),(271,68,3,'판매를 중단한다'),(272,68,4,'가격을 낮춘다'),(273,69,1,'가격'),(274,69,2,'상품의 색'),(275,69,3,'물건 무게'),(276,69,4,'판매자 수'),(277,70,1,'시장에서는 물건만 보관한다'),(278,70,2,'시장에서는 판매만 가능하다'),(279,70,3,'사람들이 물건과 돈을 주고받는 장소이다'),(280,70,4,'시장에서는 물건을 주지 않는다'),(281,71,1,'친구가 하라고 해서'),(282,71,2,'잘 알아보고 결정하는 것'),(283,71,3,'무조건 돈을 많이 쓰는 것'),(284,71,4,'아무거나 사는 것'),(285,72,1,'주식을 산다'),(286,72,2,'장난감을 사서 나중에 판다'),(287,72,3,'땅을 산다'),(288,72,4,'아이스크림을 사서 바로 먹는다'),(289,73,1,'나중을 위해 돈을 모은다'),(290,73,2,'항상 돈을 잃는다'),(291,73,3,'항상 돈을 번다'),(292,73,4,'돈을 모두 쓴다'),(293,74,1,'저축은 위험하다'),(294,74,2,'투자는 항상 이익이다'),(295,74,3,'저축은 안전하고, 투자는 위험이 있다'),(296,74,4,'저축은 돈을 모두 쓴다'),(297,75,1,'내가 직접 알아보고 결정한다'),(298,75,2,'무조건 산다'),(299,75,3,'아무것도 안 산다'),(300,75,4,'친구에게 돈을 준다'),(301,76,1,'돈을 모두 투자한다'),(302,76,2,'감당할 수 있는 만큼만 투자한다'),(303,76,3,'아무거나 투자한다'),(304,76,4,'친구가 하라는 대로 한다'),(305,77,1,'돈이 항상 줄어든다'),(306,77,2,'돈이 항상 같다'),(307,77,3,'돈이 많이 늘어날 수 있다'),(308,77,4,'돈을 모두 잃는다'),(309,78,1,'네, 항상 번다'),(310,78,2,'항상 같다'),(311,78,3,'항상 잃는다'),(312,78,4,'아니요, 잃을 수도 있다'),(313,79,1,'아무 생각 없이 남을 따라하기'),(314,79,2,'공부하고 투자하기'),(315,79,3,'계획을 세우기'),(316,79,4,'감당할 수 있는 만큼만 투자하기'),(317,80,1,'돈이 심심해서'),(318,80,2,'돈의 가치가 변하기 때문'),(319,80,3,'돈을 숨기려고'),(320,80,4,'돈을 모두 쓰려고'),(321,81,1,'돈이 많아진다'),(322,81,2,'물건이 더 커진다'),(323,81,3,'살 수 있는 물건이 줄어든다'),(324,81,4,'돈이 무거워진다'),(325,82,1,'나라가 작다'),(326,82,2,'경제 활동이 활발하다'),(327,82,3,'사람이 적다'),(328,82,4,'돈이 없다'),(329,83,1,'살 수 있는 물건이 줄어든다'),(330,83,2,'돈이 더 예뻐진다'),(331,83,3,'돈이 더 많아진다'),(332,83,4,'돈이 무거워진다'),(333,84,1,'물건의 개수'),(334,84,2,'자동차의 수'),(335,84,3,'사람들의 수'),(336,84,4,'사람들이 돈을 얼마나 쓰는지'),(337,85,1,'물의 양'),(338,85,2,'나라 돈을 바꾸는 비율'),(339,85,3,'돈의 양'),(340,85,4,'사람의 수'),(341,86,1,'나라의 경제 활동'),(342,86,2,'생산된 물건의 값'),(343,86,3,'국민의 행복'),(344,86,4,'사람들의 소득'),(345,87,1,'돈을 모두 쓰기'),(346,87,2,'돈을 숨기기'),(347,87,3,'돈을 찢기'),(348,87,4,'저축이나 투자하기'),(349,88,1,'수입 물건 값이 내린다'),(350,88,2,'수입 물건 값이 오른다'),(351,88,3,'돈이 많아진다'),(352,88,4,'물건이 작아진다'),(353,89,1,'여러 물건의 가격이 모두 오른다'),(354,89,2,'한 가지 물건만 싸진다'),(355,89,3,'사람이 줄어든다'),(356,89,4,'물건이 많아진다'),(357,90,1,'돈이 심심해서'),(358,90,2,'돈이 예뻐서'),(359,90,3,'손해를 줄이기 위해'),(360,90,4,'돈이 무거워서'),(361,91,1,'돈이나 물건을 어려운 사람에게 주는 것'),(362,91,2,'돈을 숨기는 것'),(363,91,3,'돈을 모두 쓰는 것'),(364,91,4,'돈을 빌려주는 것'),(365,92,1,'돈만 나누는 것'),(366,92,2,'혼자만 가지는 것'),(367,92,3,'아무것도 안 하는 것'),(368,92,4,'돈, 물건, 마음, 시간 등을 나누는 것'),(369,93,1,'돈이 많아진다'),(370,93,2,'세상을 더 따뜻하게 만든다'),(371,93,3,'물건이 줄어든다'),(372,93,4,'혼자만 잘 산다'),(373,94,1,'돈이 줄어든다'),(374,94,2,'친구가 줄어든다'),(375,94,3,'마음이 뿌듯해지고 행복해진다'),(376,94,4,'물건이 많아진다'),(377,95,1,'혼자 우산 쓰기'),(378,95,2,'친구와 우산 함께 쓰기'),(379,95,3,'우산을 숨기기'),(380,95,4,'우산을 버리기'),(381,96,1,'네, 돈으로만 해야 해요'),(382,96,2,'아니요, 물건으로만 해야 해요'),(383,96,3,'아니요, 돈, 물건, 시간 등 다양하게 할 수 있어요'),(384,96,4,'기부는 아무나 못 해요'),(385,97,1,'서로 도우며 살아가는 사회가 되기 때문'),(386,97,2,'돈이 많아지기 때문'),(387,97,3,'물건이 많아지기 때문'),(388,97,4,'혼자만 잘 살기 때문'),(389,98,1,'혼자만 잘 산다'),(390,98,2,'함께 잘 사는 사회가 된다'),(391,98,3,'돈이 줄어든다'),(392,98,4,'친구가 사라진다'),(393,99,1,'돈이 많아진다'),(394,99,2,'물건이 많아진다'),(395,99,3,'혼자만 잘 산다'),(396,99,4,'따뜻한 마음을 가진 어른이 될 수 있다'),(397,100,1,'기부를 하지 않기'),(398,100,2,'내가 할 수 있는 작은 것부터 시작하기'),(399,100,3,'친구 따라 하기'),(400,100,4,'돈을 모두 쓰기');
/*!40000 ALTER TABLE `quiz_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_progress`
--

DROP TABLE IF EXISTS `quiz_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_progress` (
  `quiz_progress_id` int NOT NULL AUTO_INCREMENT COMMENT '퀴즈 진행률 ID',
  `quiz_pass` tinyint(1) NOT NULL DEFAULT '0' COMMENT '퀴즈 패스 여부',
  `user_character_id` int NOT NULL COMMENT '유저가 생성한 캐릭터의 id',
  `curriculum_id` int NOT NULL COMMENT '커리큘럼 id',
  PRIMARY KEY (`quiz_progress_id`),
  UNIQUE KEY `quiz_progress_id` (`quiz_progress_id`),
  KEY `user_character_id` (`user_character_id`),
  KEY `curriculum_id` (`curriculum_id`),
  CONSTRAINT `quiz_progress_ibfk_1` FOREIGN KEY (`user_character_id`) REFERENCES `user_characters` (`user_character_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `quiz_progress_ibfk_2` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculum` (`curriculum_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_progress`
--

LOCK TABLES `quiz_progress` WRITE;
/*!40000 ALTER TABLE `quiz_progress` DISABLE KEYS */;
INSERT INTO `quiz_progress` VALUES (1,1,1,1),(2,1,1,2),(3,1,1,3),(4,1,1,8),(5,1,1,4),(6,1,1,6),(7,1,1,5),(8,1,1,9),(9,1,3,1),(10,1,3,2),(11,1,4,1),(12,1,4,2),(13,1,6,1),(14,1,6,2);
/*!40000 ALTER TABLE `quiz_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scenes`
--

DROP TABLE IF EXISTS `scenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scenes` (
  `scene_id` int NOT NULL AUTO_INCREMENT,
  `background` varchar(50) NOT NULL,
  `story_id` int NOT NULL,
  PRIMARY KEY (`scene_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `scenes_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scenes`
--

LOCK TABLES `scenes` WRITE;
/*!40000 ALTER TABLE `scenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `scenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stories`
--

DROP TABLE IF EXISTS `stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stories` (
  `story_id` int NOT NULL AUTO_INCREMENT COMMENT '스토리 ID',
  `story_title` varchar(255) NOT NULL COMMENT '스토리 제목',
  `simple_description` text COMMENT '간단한 설명',
  `curriculum_id` int NOT NULL COMMENT '커리큘럼 ID',
  PRIMARY KEY (`story_id`),
  KEY `curriculum_id` (`curriculum_id`),
  CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculum` (`curriculum_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stories`
--

LOCK TABLES `stories` WRITE;
/*!40000 ALTER TABLE `stories` DISABLE KEYS */;
INSERT INTO `stories` VALUES (1,'1장: 전학 온 첫날, 돈이 뭐지?','돈의 개념',1),(2,'2장: 똑똑한 소비','합리적인 소비',2),(3,'3장: 지출 계획과 용돈 기입장','용돈 관리',3),(4,'4장: 저축의 중요성','저축',4),(5,'5장: 신용과 부채 관리','신용과 대출',5),(6,'6장: 보험의 개념과 중요성','보험',6),(7,'7장: 시장과 가격 변동','시장 경제',7),(8,'8장: 투자와 저축의 차이','투자',8),(9,'9장: 나라의 돈과 가치 변화','화폐 가치',9),(10,'10장: 기부와 나눔의 중요성','기부',10);
/*!40000 ALTER TABLE `stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_character`
--

DROP TABLE IF EXISTS `story_character`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story_character` (
  `character_id` int NOT NULL AUTO_INCREMENT,
  `character_name` varchar(255) NOT NULL,
  PRIMARY KEY (`character_id`),
  UNIQUE KEY `character_name` (`character_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_character`
--

LOCK TABLES `story_character` WRITE;
/*!40000 ALTER TABLE `story_character` DISABLE KEYS */;
/*!40000 ALTER TABLE `story_character` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_progress`
--

DROP TABLE IF EXISTS `story_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story_progress` (
  `story_progress_id` int NOT NULL AUTO_INCREMENT,
  `story_pass` tinyint(1) NOT NULL DEFAULT '0',
  `user_character_id` int NOT NULL,
  `story_id` int NOT NULL,
  PRIMARY KEY (`story_progress_id`),
  KEY `user_character_id` (`user_character_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `story_progress_ibfk_1` FOREIGN KEY (`user_character_id`) REFERENCES `user_characters` (`user_character_id`) ON UPDATE CASCADE,
  CONSTRAINT `story_progress_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_progress`
--

LOCK TABLES `story_progress` WRITE;
/*!40000 ALTER TABLE `story_progress` DISABLE KEYS */;
INSERT INTO `story_progress` VALUES (1,1,1,1),(2,1,1,2),(3,1,1,3),(4,1,3,1),(5,1,3,2),(6,1,4,1),(7,1,4,2),(8,1,6,1),(9,1,6,2);
/*!40000 ALTER TABLE `story_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL COMMENT 'users.user_id 참조',
  `token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (4,'b','c4f67aad308d4f945a5924a1f1df2ae8b6c8db0e2a2168d25dddaa8fd8f0489e','2025-06-07 03:54:11');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_characters`
--

DROP TABLE IF EXISTS `user_characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_characters` (
  `user_character_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `nickname` varchar(20) NOT NULL DEFAULT '토룡이',
  `money` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_character_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_characters_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_characters`
--

LOCK TABLES `user_characters` WRITE;
/*!40000 ALTER TABLE `user_characters` DISABLE KEYS */;
INSERT INTO `user_characters` VALUES (1,'a','지우',1800),(2,'test','테스트',1000),(3,'test2','토룡이',200),(4,'b','수정이',1400),(5,'test4','수정',1000),(6,'test5','수정',50000);
/*!40000 ALTER TABLE `user_characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL COMMENT '사용자 ID',
  `password` varchar(255) NOT NULL COMMENT '비밀번호',
  `phone` varchar(255) NOT NULL COMMENT '전화번호',
  `email` varchar(255) DEFAULT NULL COMMENT '이메일 주소',
  `birthdate` date DEFAULT NULL COMMENT '생년월일',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('a','$2b$10$/mo0E3bhEDVWDSZUOdwbf.a9kunaNehDY07MUMRTStqrjcS4VDloO','01072488011','kjiwoo0706@gmail.com','2004-07-06','2025-05-28 13:07:16'),('b','$2b$10$Kgqrft.n/u2N1niMu4kXCepOuYV0dEh4XlbN53D0snadFSgEFU32O','12345678900','b@b.com','2000-01-01','2025-06-07 03:45:55'),('c','$2b$10$GB.xJuAvekpTSCUr6hmFkuBlTX2Tw7ky/0qiRhV3UC65bFIvBR20e','01044445555','c@c.com','2001-01-01','2025-06-07 04:02:49'),('test','$2b$10$rHud9SfSxvgPQChCodbskeVU3Iqs3raqJzCY1LnmOg2AMC3HLshnq','01011111112','aaaa@gmail.com','2004-05-11','2025-05-29 12:03:18'),('test2','$2b$10$.J75o1HFbmJgJf9es1Qbs.AgYteVqRYiQc/0KDeg4eoqFpuDmkR2.','01011112222','test2@gamil.com','2001-06-02','2025-06-06 16:23:22'),('test3','$2b$10$o9qgzG0SnSSczJ3yT/KgaOlLAmTNyX9S3jpeysXx86MFavuY4hz26','01011223344','20231145@sungshin.ac.kr','2001-06-02','2025-06-06 16:55:01'),('test4','$2b$10$qcusZIUKGwxxUGEeLo21xO06ezZnPhrGI343DUFGGv7f7VCMic5/G','01088889999','test4@gmail.com','2001-01-01','2025-06-10 11:59:10'),('test5','$2b$10$iQ67Vh.INQrAGoWcOoZ/wuVLye25.d2kgdo90i2A1utXpaSJQkO16','01099998888','test5@gmail.com','2001-01-01','2025-06-10 12:01:53');
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

-- Dump completed on 2025-06-18  5:27:28
