CREATE DATABASE `sellmeanauto`;

DROP TABLE IF EXISTS `sellmeanauto`.`temp_registration`;
CREATE TABLE  `sellmeanauto`.`temp_registration` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `fname` varchar(75) default NULL,
  `lname` varchar(75) default NULL,
  `email` varchar(105) default NULL,
  `about_user` text,
  `img_path` text,
  `cell_no` varchar(45) default NULL,
  `tell_no` varchar(45) default NULL,
  `fax_no` varchar(45) default NULL,
  `street` text,
  `city_town` text,
  `state_province` text,
  `zip_code` varchar(45) default NULL,
  `password` text,
  `ran` text,
  `account_activated` enum('Y','N') NOT NULL default 'N',
  `date_registered` datetime default NULL,
  `date_activated` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;