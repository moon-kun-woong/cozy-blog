CREATE TABLE `member_connection` (
	`uid` text PRIMARY KEY NOT NULL,
	`access_token` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meta` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`title` text NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `space`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meta_content` (
	`id` text PRIMARY KEY NOT NULL,
	`meta_id` text NOT NULL,
	`json` text NOT NULL,
	FOREIGN KEY (`meta_id`) REFERENCES `meta`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meta_image` (
	`id` text PRIMARY KEY NOT NULL,
	`meta_id` text NOT NULL,
	`category` integer DEFAULT 1 NOT NULL,
	`url` text NOT NULL,
	`seq` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`meta_id`) REFERENCES `meta`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`state` integer DEFAULT 1 NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`tags` text NOT NULL,
	`description` text NOT NULL,
	`thumbnail` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `space`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `post_content` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`json` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `post_like` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`space_id` text NOT NULL,
	`state` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`space_id`) REFERENCES `space`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `refresh_request` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`source_type` integer DEFAULT 1 NOT NULL,
	`page_id` text NOT NULL,
	`type` integer DEFAULT 1 NOT NULL,
	`state` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `space`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `space` (
	`id` text PRIMARY KEY NOT NULL,
	`uid` text NOT NULL,
	`slug` text NOT NULL,
	`meta_database_id` text NOT NULL,
	`post_database_id` text NOT NULL,
	`title` text NOT NULL,
	`state` integer DEFAULT 1 NOT NULL,
	`last_refreshed_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `meta_content_meta_id_unique` ON `meta_content` (`meta_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_content_post_id_unique` ON `post_content` (`post_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `space_slug_unique` ON `space` (`slug`);