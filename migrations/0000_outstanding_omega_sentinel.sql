CREATE TABLE `post` (
	`id` text PRIMARY KEY NOT NULL,
	`spaceId` text NOT NULL,
	`state` integer NOT NULL,
	`content` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`tags` text NOT NULL,
	`description` text NOT NULL,
	`thumbnail` text DEFAULT '' NOT NULL,
	`createdAt` integer DEFAULT (unix_timestamp()) NOT NULL,
	`updatedAt` integer DEFAULT (unix_timestamp()) NOT NULL,
	FOREIGN KEY (`spaceId`) REFERENCES `space`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `postContent` (
	`id` text PRIMARY KEY NOT NULL,
	`postId` text NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `space` (
	`id` text PRIMARY KEY NOT NULL,
	`uid` text NOT NULL,
	`slug` text NOT NULL,
	`metaDatabaseId` text NOT NULL,
	`postDatabaseId` text NOT NULL,
	`title` text NOT NULL,
	`state` integer NOT NULL,
	`lastRefreshedAt` integer DEFAULT (unix_timestamp()) NOT NULL,
	`createdAt` integer DEFAULT (unix_timestamp()) NOT NULL,
	`updatedAt` integer DEFAULT (unix_timestamp()) NOT NULL
);
