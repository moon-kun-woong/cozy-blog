import { t } from "elysia";

export enum Direction {
    ASC,
    DESC
}

export const pageQuery = t.Object({
    page: t.Number({ default: 0 }),
    size: t.Number({ default: 20 }),
    direction: t.Enum(Direction, { default: Direction.DESC }),
    sort: t.Array(t.String({default:"sort"})),
})

export const pages = t.Object({
    content: t.Array(t.Object({})),
    currentPage: t.Number(),
    totalPage: t.Number(),
    totalCount: t.Number(),
})

export function toPageable(schema: any) {
    const { page, size } = schema
    if (pageQuery.sort = []) {
        return t.Composite([
            pages,
            t.Object({
                page,
                size
            })
        ])
    } else {
        return t.Composite([
            page,
            t.Object({ content: schema })
        ])
    }
}




