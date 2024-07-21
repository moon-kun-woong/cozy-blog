import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';


export const space = sqliteTable('space', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    uid: text('uid').notNull(),
    slug: text('slug').notNull(),
    metaDatabaseId: text('metaDatabaseId').notNull(),
    postDatabaseId: text('postDatabaseId').notNull(),
    title: text('title').notNull(),
    state: integer('state').notNull(),
    lastRefreshedAt: integer('lastRefreshedAt', { mode: 'timestamp' }).notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export type Space = typeof space.$inferSelect;