CREATE TABLE `journal_tags` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`journal_id` int NOT NULL,
	`tag` text NOT NULL,
	CONSTRAINT `journal_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `favourite` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `created_by_user_id` int NOT NULL;