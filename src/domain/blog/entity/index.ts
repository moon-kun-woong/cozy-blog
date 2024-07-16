import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';


export const space = sqliteTable('space', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    uid: text('uid').notNull(),
    slug: text('slug').notNull(),
    metaDatabaseId: text('metaDatabaseId').$default(() => "Empty"),
    postDatabaseId: text('postDatabaseId').$default(() => "Empty"),
    title: text('title').notNull(),
    state: text('state', { enum: ['NONE', 'ACTIVATED', 'ARCHIVED', 'DELETED'] }).$default(() => "NONE")
});

export type Space = typeof space.$inferSelect;