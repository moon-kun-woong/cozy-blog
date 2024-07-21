import { t, Elysia } from "elysia";

export const pageQuery = t.Object({
    page: t.Integer({ default: 0 }),
    size: t.Integer({ default: 20 }),
})