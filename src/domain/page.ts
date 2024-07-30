import { t } from "elysia";

export enum Direction {
    ASC,
    DESC
}

export const pageQuery = t.Object({
    page: t.Number({ default: 0 }),
    size: t.Number({ default: 20 }),
    direction: t.Enum(Direction, { default: Direction.DESC }),
    sort: t.Array(t.String()),
})

export const page = t.Object({
    content: t.Array(t.Object({})),
    currentPage: t.Number(),
    totalPage: t.Number(),
    totalCount: t.Number(),
})

export function toPageable() {
    if (pageQuery.sort = []) {
        return {
            page: page,
            size: pageQuery.size
        }
    } else {
        return {
            page: page,
            size: pageQuery.size,
            direction: pageQuery.direction,
            sort: pageQuery.sort
        }
    }
}




