import { t } from "elysia";

export const pageQuery = t.Object({
    page: t.Optional(t.String()),
    size: t.Optional(t.String()),
    sort: t.Optional(t.Array(t.String())),
})

export const pages = t.Object({
    content: t.Array(t.Object({})),
    currentPage: t.Number(),
    totalPage: t.Number(),
    totalCount: t.Number(),
})