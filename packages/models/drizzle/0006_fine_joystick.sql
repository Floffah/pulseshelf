CREATE TABLE `period_entries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(36) NOT NULL,
	`summary` text NOT NULL,
	`created_by_user_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT now(),
	CONSTRAINT `period_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `period_entries_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `period_entry_songs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`journal_id` int NOT NULL,
	`song_source` enum('SPOTIFY') NOT NULL,
	`song_id` varchar(64) NOT NULL,
	CONSTRAINT `period_entry_songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `journal_id_idx` ON `period_entry_songs` (`journal_id`);