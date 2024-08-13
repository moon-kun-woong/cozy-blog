import { TSchema, t } from "elysia";

export const pageQuery = t.Object({
    page: t.Optional(t.String()),
    size: t.Optional(t.String()),
    sort: t.Optional(t.Array(t.String())),
})

export const pages = t.Object({
    currentPage: t.Number(),
    totalPage: t.Number(),
    totalCount: t.Number(),
})

export function pageResponse<T extends TSchema>(schema: T) {
    return t.Composite([pages, t.Object({content: schema})])
}