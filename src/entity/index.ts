import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Space related definitions
export const SpaceState = {
  NONE: 0,
  ACTIVATED: 1,
  ARCHIVED: 2,
  DELETED: 3,
} as const;

export const space = sqliteTable(
  "space",
  {
    id: text("id").primaryKey(),
    uid: text("uid").notNull(),
    slug: text("slug").notNull().unique(),
    metaDatabaseId: text("meta_database_id").notNull(),
    postDatabaseId: text("post_database_id").notNull(),
    title: text("title").notNull(),
    state: integer("state").notNull().default(SpaceState.ACTIVATED),
    lastRefreshedAt: integer("last_refreshed_at", {
      mode: "timestamp",
    }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    uidIdx: index("space_uid_idx").on(table.uid),
  }),
);

// Post related definitions
export const PostState = {
  NONE: 0,
  DRAFT: 1,
  PUBLISHED: 2,
  DELETED: 3,
} as const;

export const post = sqliteTable(
  "post",
  {
    id: text("id").primaryKey(),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),
    state: integer("state").notNull().default(PostState.DRAFT),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    tags: text("tags").notNull(),
    description: text("description").notNull(),
    thumbnail: text("thumbnail").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    slugIdx: index("post_slug_idx").on(table.slug),
  }),
);

export const postContent = sqliteTable("post_content", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .unique()
    .references(() => post.id),
  json: text("json", { mode: "json" }).notNull(),
});

// PostLike related definitions
export const PostLikeState = {
  NONE: 0,
  EXISTED: 1,
  DELETED: 2,
} as const;

export const postLike = sqliteTable("post_like", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => post.id),
  spaceId: text("space_id")
    .notNull()
    .references(() => space.id),
  state: integer("state").notNull().default(PostLikeState.EXISTED),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Meta related definitions
export const MetaTitle = {
  NONE: "NONE",
  HOME: "HOME",
  ABOUT: "ABOUT",
  PROFILE: "PROFILE",
} as const;

export const meta = sqliteTable("meta", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => space.id),
  title: text("title").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const metaContent = sqliteTable("meta_content", {
  id: text("id").primaryKey(),
  metaId: text("meta_id")
    .notNull()
    .unique()
    .references(() => meta.id),
  json: text("json", { mode: "json" }).notNull(),
});

export const MetaImageCategory = {
  NONE: 0,
  MAIN: 1,
  SUB: 2,
} as const;

export const metaImage = sqliteTable("meta_image", {
  id: text("id").primaryKey(),
  metaId: text("meta_id")
    .notNull()
    .references(() => meta.id),
  category: integer("category").notNull().default(MetaImageCategory.MAIN),
  url: text("url").notNull(),
  seq: integer("seq").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// RefreshRequest related definitions
export const RefreshRequestSourceType = {
  NONE: 0,
  SPACE: 1,
  POST: 2,
  META: 3,
} as const;

export const RefreshRequestType = {
  NONE: 0,
  POST: 1,
  META: 2,
} as const;

export const RefreshRequestState = {
  NONE: 0,
  TODO: 1,
  IN_PROGRESS: 2,
  DONE: 3,
  FAIL: 4,
  CANCELED: 5,
  TERMINATED: 6,
} as const;

export const refreshRequest = sqliteTable("refresh_request", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => space.id),
  sourceType: integer("source_type")
    .notNull()
    .default(RefreshRequestSourceType.SPACE),
  pageId: text("page_id").notNull(),
  type: integer("type").notNull().default(RefreshRequestType.POST),
  state: integer("state").notNull().default(RefreshRequestState.TODO),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// MemberConnection definition
export const memberConnection = sqliteTable("member_connection", {
  uid: text("uid").primaryKey(),
  accessToken: text("access_token").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
