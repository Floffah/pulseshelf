CREATE TABLE `registration_invite` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	CONSTRAINT `registration_invite_id` PRIMARY KEY(`id`),
	CONSTRAINT `registration_invite_email_unique` UNIQUE(`email`)
);
