import { relations, sql } from 'drizzle-orm';
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

export const spaceRelations = relations(space, ({ many }) => ({
    post: many(post),
}))

export type Space = typeof space.$inferSelect;

export const post = sqliteTable('post', {
    id: text('id').primaryKey(),
    spaceId: text('spaceId').references(() => space.id, {onDelete: 'cascade'}).notNull(),
    state: integer('state').notNull(),
    content: text('content').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    tags: text('tags').notNull(),
    description: text('description').notNull(),
    thumbnail: text('thumbnail').notNull().default(""),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unix_timestamp())`),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unix_timestamp())`),
});

export const postRelations = relations(post, ({ one }) => ({
    spaceId: one(space, {
        fields: [post.spaceId],
        references: [space.id],
    }),
    postContent: one(postContent)
}))

export type Post = typeof post.$inferSelect;

export const postContent = sqliteTable('postContent', {
    id: text('id').primaryKey(),
    postId: text('postId').references(() => post.id, {onDelete: 'cascade'}).notNull(),
});

export const postContentRelation = relations(postContent, ({ one }) => ({
    post: one(post, {
        fields: [postContent.postId],
        references: [post.id],
    })
}));

export type PostContent = typeof postContent.$inferSelect;