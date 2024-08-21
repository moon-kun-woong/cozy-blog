import Elysia, { t } from "elysia";
import { pageQuery, pageResponse, pages } from "../../page";

export enum PostState {
    NONE = 0,
    DRAFT = 1,
    PUBLISHED = 2,
    DELETED = 3
}

export const space = t.Object({
    name: t.String(),
    slug: t.String(),
    id: t.String(),
})

export const postContent = t.Object({
    id: t.String(),
    postId: t.String()
})

export const querySchema = t.Object({
    space: t.String({ default: null }),
    spaceId: t.Array(t.String({default: null})),
    slug: t.Array(t.String({ default: null })),
    state: t.Array(t.Enum(PostState, { default: null })),
    title: t.Array(t.String({ default: null })),
    description: t.Array(t.String({ default: null })),
    id: t.Array(t.String({ default: null })),
})

export const simpleSchema = t.Object({
    id: t.String(),
    state: t.Enum(PostState),
    slug: t.String(),
    title: t.String(),
    tags: t.String(),
    description: t.String(),
    thumbnail: t.String(),
    updatedAt: t.Date(),
    space: space,
})

export const detailSchema = t.Object({
    id: t.String(),
    state: t.Enum(PostState),
    content: postContent,
    slug: t.String(),
    title: t.String(),
    tags: t.String(),
    description: t.String(),
    thumbnail: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    space: space,
})

export const postModel = new Elysia()
    .model({
        query: querySchema,
        simples: pageResponse(t.Array(simpleSchema)),
        detail: detailSchema,
        pageQuery: pageQuery,
        pages: pages
    })