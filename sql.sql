set foreign_key_checks=0;
-- ----------------------------
-- Table structure for users
-- ---------------------------- 
drop table if exists users;
create table users(
	id int(10) not null primary key auto_increment,
    username varchar(30) not null,
    password char(30) not null,
    createtime timestamp null default null on update current_timestamp,
    modifytime timestamp null default null on update current_timestamp
)ENGINE=INNODB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4