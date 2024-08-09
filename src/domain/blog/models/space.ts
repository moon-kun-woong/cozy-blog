import { isNotNull, isNull } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { pageQuery, pages } from "../../page";

export enum SpaceState {
    NONE = 0,
    ACTIVATED = 1,
    ARCHIVED = 2,
    DELETED = 3
}

export const querySchema = t.Object({
    id: t.Array(t.String({ default: null })),
    uid: t.Array(t.String({ default: null })),
    title: t.Array(t.String({ default: null })),
    state: t.Array(t.Enum(SpaceState, { default: null })),
    slug: t.Array(t.String({ default: null })),
})

export const simpleSchema = t.Object({
    id: t.String(),
    slug: t.String(),
    title: t.String(),
    state: t.Enum(SpaceState),
    uid: t.String()
})

export const detailSchema = t.Object({
    id: t.String(),
    uid: t.String(),
    slug: t.String(),
    metaDatabaseId: t.String(),
    postDatabaseId: t.String(),
    title: t.String(),
    state: t.Enum(SpaceState),
    lastRefreshedAt: t.Date(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
})

export const createSchema = t.Object({
    metaDatabaseId: t.String(),
    postDatabaseId: t.String(),

    title: t.String(),
    uid: t.String()
})

export const updateSchema = t.Object({
    title: t.String({default: null}),
    state: t.Enum(SpaceState, {default: null}),
    metaDatabaseId: t.String({default: null}),
    postDatabaseId: t.String({default: null})
})

export const refreshActionSchema = t.Object({
    type: t.String(isNotNull)
})

export const availabilityQuerySchema = t.Object({
    title: t.Optional(t.String(isNull)),
    slug: t.Optional(t.String(isNull))
})

export const spaceModel = new Elysia()
    .model({
        query: querySchema,
        simples: simpleSchema,
        detail: detailSchema,
        create: createSchema,
        update: updateSchema,
        refresh: refreshActionSchema,
        availabilityQuery: availabilityQuerySchema,
        pageQuery: pageQuery,
        pages: pages
    })