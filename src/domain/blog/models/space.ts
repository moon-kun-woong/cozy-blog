import Elysia, { t } from "elysia";

export enum SpaceState {
    NONE = 0,
    ACTIVATED = 1,
    ARCHIVED = 2,
    DELETED = 3
}

function defaultUuid(): string {
    return '00000000-0000-0000-0000-000000000000';
}

export function spaceStateToId(state: SpaceState): number {
    return state;
}

export const querySchema = t.Object({
    id: t.Array(t.String({ default: defaultUuid })), // type : UUID 로 바꿔야하는데 모르겠음.
    uid: t.Array(t.String({ default: "test_space" })),
    slug: t.Array(t.String({ default: "default" })),
    title: t.Array(t.String({ default: "test_title" })),
    state: t.Array(t.Enum(SpaceState, { default: SpaceState.ACTIVATED })),
})

export const simpleSchema = t.Object({
    id: t.Number({ default: 0 }),
    slug: t.String({ default: "default" }),
    title: t.String({ default: "test_title" }),
    state: t.Enum(SpaceState, { default: SpaceState.ACTIVATED }),
    uid: t.String({ default: "test_space" })
})

export const detailSchema = t.Composite([
    simpleSchema,
    t.Object({
        metaDatabaseId: t.String({ default: defaultUuid }),
        postDatabaseId: t.String({ default: defaultUuid }),
        lastRefreshedAt: t.Date(new Date),
        createdAt: t.Date(new Date),
        updatedAt: t.Date(new Date)
    })
])

export const createSchema = t.Object({
    slug: t.String(),
    metaDatabaseId: t.String({ default: defaultUuid }),
    postDatabaseId: t.String({ default: defaultUuid }),
    title: t.String(),
    uid: t.String()
})

export const updateSchema = t.Object({
    title: t.String(),
    state: t.Enum(SpaceState, { default: SpaceState.ACTIVATED }),
    metaDatabaseId: t.String({ default: defaultUuid }),
    postDatabaseId: t.String({ default: defaultUuid })
})

export const refreshActionSchema = t.Object({

})

export const availabilityQuerySchema = t.Object({
    title: t.String(),
    slug: t.String()
})

export const spaceModel = new Elysia()
    .model({
        querySchema,
        simpleSchema,
        detailSchema,
        createSchema,
        updateSchema,
        refreshActionSchema,
        availabilityQuerySchema
    })