import { App } from "../../../types";
import { space } from '../../../domain/blog/entity/index'
import { sql } from 'drizzle-orm'
import { spaceModel, SpaceState } from "../models/space";

export default function (app: App): any {
    return app
        .use(spaceModel)
        .get("/", async ({ db }) => {

            const result = await db
                .select()
                .from(space)
                .all();

            return result;
        })

        .get("/:slug", async ({ db, params: { slug } }) => {
            const [result] = await db
                .select()
                .from(space)
                .where(sql`slug=${slug}`);

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
                    state:SpaceState.ACTIVATED
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
                .where(sql`slug=${slug}`).returning();

            return result;
        }, { body: "update" , response:"detail"})

        .delete("/:slug", async ({ db, params: { slug } }) => {
            const result = await db
                .delete(space)
                .where(sql`slug=${slug}`);

            return result;
        })

        .post("/:slug/refresh_action",async ({params: { slug }, query}) => {

        }, {query:"refresh"})
}