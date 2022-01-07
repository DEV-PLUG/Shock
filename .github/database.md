# Shock - Mysql Database Source

## Database Source  
```mysql
CREATE DATABASE shock
    DEFAULT CHARACTER SET = 'utf8mb4';
```

## Table Source - Class
```mysql
CREATE TABLE `class_info` (
  `seq` int NOT NULL AUTO_INCREMENT,
  `class_id` varchar(18) DEFAULT NULL COMMENT '클래스 아이디',
  `class_owner` varchar(50) DEFAULT NULL COMMENT '클래스 소유자',
  `class_name` varchar(50) DEFAULT NULL COMMENT '클래스 이름',
  `class_invite_code` varchar(50) DEFAULT NULL COMMENT '클래스 초대코드',
  `class_students` text COMMENT '클래스 학생들',
  `createdAt` datetime DEFAULT NULL COMMENT '생성일',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `class_des` varchar(125) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=235 DEFAULT CHARSET=utf8mb3 COMMENT='클래스 정보'
```

## Table Source - Study Log
```mysql
CREATE TABLE `study_log` (
  `seq` int NOT NULL AUTO_INCREMENT,
  `log_id` varchar(18) DEFAULT NULL COMMENT '로그 아이디',
  `log_class` varchar(18) DEFAULT NULL COMMENT '로그 클래스',
  `log_user` varchar(50) DEFAULT NULL COMMENT '로그 사용자',
  `log_wrong_words` text COMMENT '틀린 문제',
  `createdAt` datetime DEFAULT NULL COMMENT '생성일',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `log_words_id` varchar(18) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=239 DEFAULT CHARSET=utf8mb3 COMMENT='학습 로그'
```

## Table Source - System Error Log
```mysql
CREATE TABLE `system_error_log` (
  `seq` int NOT NULL AUTO_INCREMENT,
  `log_type` text,
  `log_content` text,
  `log_date` timestamp NULL DEFAULT NULL,
  `log_ip` text,
  `log_error` text,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=493 DEFAULT CHARSET=utf8mb3
```

## Table Source - System Log
```mysql
CREATE TABLE `system_log` (
  `seq` int NOT NULL AUTO_INCREMENT,
  `log_type` text,
  `log_content` text,
  `log_date` timestamp NULL DEFAULT NULL,
  `log_ip` text,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=1772 DEFAULT CHARSET=utf8mb3
```

## Table Source - User
```mysql
CREATE TABLE `user_info` (
  `seq` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) DEFAULT NULL COMMENT '유저 이름',
  `user_email` varchar(798) DEFAULT NULL COMMENT '이메일',
  `user_password` text COMMENT '비밀번호',
  `createdAt` datetime DEFAULT NULL COMMENT '생성일',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `salt` text COMMENT 'salt',
  `token` text,
  `class` text,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb3 COMMENT='유저 정보'
```

## Table Source - Words
```mysql
CREATE TABLE `words_info` (
  `seq` int NOT NULL AUTO_INCREMENT,
  `words_id` varchar(18) DEFAULT NULL COMMENT '단어 아이디',
  `words_owner` varchar(50) DEFAULT NULL COMMENT '단어 소유자',
  `words_text` text COMMENT '단어',
  `createdAt` datetime DEFAULT NULL COMMENT '생성일',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `words_title` varchar(50) DEFAULT NULL,
  `last_learning_date` datetime DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb3 COMMENT='매니저 정보'
```
