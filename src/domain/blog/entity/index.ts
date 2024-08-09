import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const space = sqliteTable('space', {
    id: text('id').primaryKey(),
    uid: text('uid').notNull(),
    slug: text('slug').notNull(),
    metaDatabaseId: text('metaDatabaseId').notNull(),
    postDatabaseId: text('postDatabaseId').notNull(),
    title: text('title').notNull(),
    state: integer('state').notNull(),
    lastRefreshedAt: integer('lastRefreshedAt', { mode: 'timestamp' }).notNull().default(sql`(unix_timestamp())`),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unix_timestamp())`),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unix_timestamp())`),
});

export type Space = typeof space.$inferSelect;