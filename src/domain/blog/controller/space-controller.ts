import { App } from "../../../types";
import { space } from '../../../domain/blog/entity/index'
import { count, eq, sql } from 'drizzle-orm'
import { spaceModel, SpaceState } from "../models/space";
import { v4 as uuidv4 } from 'uuid';

export default function (app: App): any {
    return app
        .use(spaceModel)
        .get("/", async ({ db, query }) => {
            const currentPage = parseInt(query.page ?? '0');
            const sizeNumber = parseInt(query.size ?? '20');

            const offset = currentPage * sizeNumber;

            const content = await db
                .select({
                    id: space.id,
                    uid: space.uid,
                    title: space.title,
                    state: space.state,
                    slug: space.slug
                })
                .from(space)
                .limit(sizeNumber)
                .offset(offset)
                .all()

            const [totalCount] = await db
                .select({ count: count() })
                .from(space)

            return {
                content,
                currentPage,
                totalPage: Math.ceil(totalCount.count / sizeNumber),
                totalCount: totalCount.count
            }
        }, { response: "simples", query: "pageQuery", detail: { tags: ['space'] } })

        .get("/:slug", async ({ db, params: { slug } }) => {
            const [result] = await db
                .select()
                .from(space)
                .where(eq(space.slug, slug));

            return result;
        }, { response: "detail", detail: { tags: ['space'] } })

        .post("/:slug", async ({ db, params: { slug }, body }) => {
            const { uid, title, metaDatabaseId, postDatabaseId } = body;
            const createdId = uuidv4();

            const [result] = await db
                .insert(space)
                .values({
                    id: createdId,
                    uid,
                    slug,
                    metaDatabaseId,
                    postDatabaseId,
                    title,
                    state: SpaceState.ACTIVATED,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lastRefreshedAt: new Date(),
                }).returning();

            return result;
        }, { body: 'create', response: "detail", detail: { tags: ['space'] } })

        .put("/:slug", async ({ db, params: { slug }, body }) => {
            const { metaDatabaseId, postDatabaseId, title, state } = body;
            const [result] = await db
                .update(space)
                .set({
                    title,
                    state,
                    metaDatabaseId,
                    postDatabaseId,
                })
                .where(eq(space.slug, slug)).returning();

            return result;
        }, { body: "update", response: "detail", detail: { tags: ['space'] } })

        .delete("/:slug", async ({ db, params: { slug } }) => {
            const result = await db
                .update(space)
                .set({ state: 3 })
                .where(eq(space.slug, slug))

            return result;
        }, { detail: { tags: ['space'] } })

        .get("/availability", async ({ query: { slug, title } }) => {
            if (slug != null && !checkSlug(slug)) return false
            if (title != null && !checkName(title)) return false
            return true
        }, { query: "availabilityQuery", detail: { tags: ['space'] } })

        .patch("/:id", async ({ db, params: { id }, body }) => {
            const { metaDatabaseId, postDatabaseId, title, state } = body;
            const [result] = await db
                .update(space)
                .set({
                    title,
                    state,
                    metaDatabaseId,
                    postDatabaseId,
                })
                .where(sql`id=${id}`).returning();

            return result;
        }, { response: "detail", body: "update", detail: { tags: ['space'] } })
}

function checkSlug(slug: any): Boolean {
    let regex = new RegExp("\w+").exec("^[a-zA-Z0-9가-힣\-_]+$")
    if (regex?.find(slug) == null) return false
    else return true
}

function checkName(title: String): Boolean {
    if (title == null) return false
    else return true
}