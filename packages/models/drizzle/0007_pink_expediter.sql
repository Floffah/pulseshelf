ALTER TABLE `period_entry_songs` RENAME COLUMN `journal_id` TO `period_id`;--> statement-breakpoint
DROP INDEX `journal_id_idx` ON `period_entry_songs`;--> statement-breakpoint
CREATE INDEX `period_id_idx` ON `period_entry_songs` (`period_id`);