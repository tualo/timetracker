DELIMITER ;
CREATE TABLE IF NOT EXISTS `mitarbeiter` (
  `id` varchar(36) NOT NULL,
  `personal_nummer` varchar(20) DEFAULT '',
  `kurzbezeichnung` varchar(8) NOT NULL,
  `titel` varchar(255) NOT NULL,
  `anreden` varchar(255) NOT NULL,
  `vorname` varchar(255) NOT NULL,
  `nachname` varchar(255) NOT NULL,
  `bemerkungen` varchar(255) NOT NULL,
  `stellenbezeichnung` varchar(255) DEFAULT '----',
  `anstellung` date NOT NULL,
  `entlassung` date DEFAULT NULL,
  `geburtstag` date DEFAULT NULL,
  `urlaubstage` int(11) DEFAULT 0,
  `strasse` varchar(255) NOT NULL DEFAULT '',
  `plz` varchar(10) NOT NULL DEFAULT '',
  `ort` varchar(255) NOT NULL DEFAULT '',
  `ortsteil` varchar(255) NOT NULL DEFAULT '',
  `kurzname` varchar(30) DEFAULT NULL,
  `user_login` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

alter table `mitarbeiter` add  `user_login` varchar(255) DEFAULT NULL;

CREATE TABLE IF NOT EXISTS `zeiterfassung` (
  `id` varchar(36) NOT NULL,
  `job_id` varchar(36) NOT NULL,
  `mitarbeiter_id` varchar(36) NOT NULL,
  `task_date` date DEFAULT NULL,
  `task_start` datetime DEFAULT NULL,
  `task_end` datetime DEFAULT NULL,
  `gruppen_id` int(11) DEFAULT NULL,
  `hours` decimal(10,2) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `internal_hour_rate` decimal(10,2) DEFAULT NULL,
  `hour_rate` decimal(10,2) DEFAULT NULL,
  `state` int(11) DEFAULT 0,
  `create_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `login` varchar(255) DEFAULT NULL,
  `belegnummer` bigint(20) DEFAULT NULL,
  `submit_to_job` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_zeiterfassung_job_id` (`job_id`),
  KEY `fk_zeiterfassung_staff_link` (`mitarbeiter_id`),
  KEY `fk_zeiterfassung_gruppen_id` (`gruppen_id`),
  CONSTRAINT `fk_zeiterfassung_gruppen_id` FOREIGN KEY (`gruppen_id`) REFERENCES `artikelgruppen` (`gruppen_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_zeiterfassung_job_id` FOREIGN KEY (`job_id`) REFERENCES `tualo_job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_zeiterfassung_staff_link` FOREIGN KEY (`mitarbeiter_id`) REFERENCES `mitarbeiter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);