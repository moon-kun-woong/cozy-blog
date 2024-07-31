import { App } from "../../../types";
import { space } from '../../../domain/blog/entity/index'
import { count, eq, sql } from 'drizzle-orm'
import { spaceModel, SpaceState } from "../models/space";

export default function (app: App): any {
    return app
        .use(spaceModel)
        .get("/", async ({ db, query: { page, size } }) => {

            const offset = page * size;

            const [content, [{ count: totalCount }]] = await Promise.all([
                db.select()
                    .from(space)
                    .limit(size)
                    .offset(offset)
                    .all(),
                db.select({ count: count() })
                    .from(space)])

            return {
                totalPage: Math.ceil(totalCount / size),
                content
            }
        }, { response: "simples", query: "pageQuery" })

        .get("/:slug", async ({ db, params: { slug } }) => {
            const [result] = await db
                .select()
                .from(space)
                .where(eq(space.slug, slug));

            return result;
        }, { response: "detail" })

        .post("/:slug", async ({ db, params: { slug }, body }) => {
            const { uid, title, metaDatabaseId, postDatabaseId } = body;
            const [result] = await db
                .insert(space)
                .values({
                    uid,
                    slug,
                    title,
                    metaDatabaseId,
                    postDatabaseId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lastRefreshedAt: new Date(),
                    state: SpaceState.ACTIVATED
                }).returning();

            return result;
        }, { body: 'create', response: "detail" })

        .put("/:slug", async ({ db, params: { slug }, body }) => {
            const { metaDatabaseId, postDatabaseId, title, state } = body;
            const [result] = await db
                .update(space)
                .set({
                    metaDatabaseId,
                    postDatabaseId,
                    title,
                    state
                })
                .where(eq(space.slug, slug)).returning();

            return result;
        }, { body: "update", response: "detail" })

        .delete("/:slug", async ({ db, params: { slug } }) => {
            const result = await db
                .delete(space)
                .where(eq(space.slug, slug));

            return result;
        })

        .post("/:slug/refresh_action", async ({ db, params: { slug }, body }) => {

            function createRefreshRequest(body: any) {
                
                function checkNewOrUpdated(){

                }
            }



        }, { body: "refresh" })

        .get("/availability", async ({ query: { slug, title } }) => {

            function checkSlug(slug: any): Boolean {
                let regex = new RegExp("\w+").exec("^[a-zA-Z0-9가-힣\-_]+$")
                if (regex?.find(slug) == null) return false
                return true
            }

            function checkName(title: String): Boolean {
                if (title == null) {
                    return false
                }
                return true
            }

            (slug: any, title: any) => {
                if (slug != null && !checkSlug(slug)) {
                    return false
                }
                if (title != null && !checkName(title)) {
                    return false
                }
                return true
            }
        }, { query: "availabilityQuery" })

        .patch("/:id", async ({ db, params: { id }, body }) => {
            const { metaDatabaseId, postDatabaseId, title, state } = body;
            const [result] = await db
                .update(space)
                .set({
                    metaDatabaseId,
                    postDatabaseId,
                    title,
                    state
                })
                .where(sql`id=${id}`).returning();

            return result;
        }, { response: "detail", body: "update" })
}