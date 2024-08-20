CREATE TABLE `journal_entries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`rating` int NOT NULL,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `journal_entries_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `journal_entry_songs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`journal_id` int NOT NULL,
	`song_source` enum('SPOTIFY') NOT NULL,
	`song_id` varchar(64) NOT NULL,
	CONSTRAINT `journal_entry_songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `journal_id_idx` ON `journal_entry_songs` (`journal_id`);