CREATE TABLE `user_oauth_providers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`oauth_provider` enum('DISCORD') NOT NULL,
	`provider_user_id` varchar(256) NOT NULL,
	CONSTRAINT `user_oauth_providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(36) NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320),
	`password_hash` varchar(72) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT now(),
	`last_active_at` datetime DEFAULT now(),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `users_name_unique` UNIQUE(`name`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(256) NOT NULL,
	`expires_at` datetime NOT NULL,
	`last_used_at` datetime,
	CONSTRAINT `user_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `user_oauth_providers` (`user_id`);--> statement-breakpoint
CREATE INDEX `provider_user_id_idx` ON `user_oauth_providers` (`provider_user_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `user_sessions` (`user_id`);