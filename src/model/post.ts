import { Elysia, t, Static } from "elysia";
import { UUID, DateTime, pageResponse } from "./global";

export const PostState = t.Enum({
  NONE: "NONE",
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  DELETED: "DELETED",
});

export const PostLikeState = t.Enum({
  NONE: "NONE",
  EXISTED: "EXISTED",
  DELETED: "DELETED",
});
const space = t.Object({
  name: t.String(),
  slug: t.String(),
  id: UUID,
});

export const query = t.Object({
  space: t.Optional(t.String()),
  spaceId: t.Optional(t.Array(UUID)),
  slug: t.Optional(t.Array(t.String())),
  state: t.Optional(t.Array(PostState)),
  title: t.Optional(t.Array(t.String())),
  description: t.Optional(t.Array(t.String())),
  spaceSlug: t.Optional(t.Array(t.String())),
  spaceName: t.Optional(t.Array(t.String())),
  id: t.Optional(t.Array(UUID)),
});

export const simple = t.Object({
  id: UUID,
  state: PostState,
  slug: t.String(),
  title: t.String(),
  tags: t.String(),
  description: t.String(),
  thumbnail: t.String(),
  viewCount: t.Number(),
  updatedAt: DateTime,
  space,
  spaceSlug: t.String(),
  spaceName: t.String(),
});

export const detail = t.Object({
  id: UUID,
  state: PostState,
  content: t.Any(),
  slug: t.String(),
  title: t.String(),
  tags: t.String(),
  description: t.String(),
  thumbnail: t.String(),
  viewCount: t.Number(),
  spaceSlug: t.String(),
  spaceName: t.String(),
  createdAt: DateTime,
  updatedAt: DateTime,
  space,
});

export const likeQuery = t.Object({
  spaceId: t.Optional(t.Array(UUID)),
  postId: t.Optional(t.Array(UUID)),
  state: t.Optional(t.Array(PostLikeState)),
});

export const likeCreate = t.Object({
  postId: UUID,
  spaceId: UUID,
  state: PostLikeState,
});

export const likeDetail = t.Object({
  id: UUID,
  state: PostLikeState,
  spaceId: UUID,
  postId: UUID,
  createdAt: DateTime,
  updatedAt: DateTime,
});

export const likeUpdate = t.Object({
  postId: t.Optional(UUID),
  spaceId: t.Optional(UUID),
  state: t.Optional(PostLikeState),
});

export type PostQuery = Static<typeof query>;
export type PostSimple = Static<typeof simple>;
export type PostDetail = Static<typeof detail>;
export type PostLikeQuery = Static<typeof likeQuery>;
export type PostLikeCreate = Static<typeof likeCreate>;
export type PostLikeDetail = Static<typeof likeDetail>;
export type PostLikeUpdate = Static<typeof likeUpdate>;

export const postModel = new Elysia().model({
  'post.query': query,
  'post.simples': pageResponse(simple),
  'post.detail': detail,
  'post.likeQuery': likeQuery,
  'post.likeCreate': likeCreate,
  'post.likeDetail': likeDetail,
  'post.likeUpdate': likeUpdate,
  'post.likeSimples': pageResponse(likeDetail),
});
