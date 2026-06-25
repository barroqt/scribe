CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
DROP INDEX `players_name_unique`;--> statement-breakpoint
ALTER TABLE `players` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
CREATE UNIQUE INDEX `players_user_name_unique` ON `players` (`user_id`,`name`);--> statement-breakpoint
ALTER TABLE `game_participants` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `games` ADD `user_id` text NOT NULL REFERENCES users(id);