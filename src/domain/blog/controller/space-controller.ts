import { App } from "../../../types";
import { space } from '../../../domain/blog/entity/index'
import { sql } from 'drizzle-orm'

export default function (app: App): any {
    return app

        .get("/", async ({ db }) => {
            const result = await db.select().from(space).all();

            return result;
        })

        .get("/:slug", async ({ db, params: { slug } }) => {
            console.log(slug);
            const result = await db.select().from(space).where(sql`slug=${slug}`);

            return { result: result, slug: slug };
        })

        .post("/:slug", async ({ db, params: { slug }, body }) => {
            const contextBody = body;
            const { uid, state, title }: any = contextBody;
            const result = await db.insert(space).values([{ uid, slug, state, title }]);

            return result;
        })

        .put("/:slug", async ({ db, params: { slug }, body }) => {
            const contextBody = body;
            const { uid, metaDatabaseId, postDatabaseId, title, state }: any = contextBody;
            const result = await db.update(space).set({ uid, metaDatabaseId, postDatabaseId, title, state }).where(sql`slug=${slug}`);

            return result;
        })

        .delete("/:slug", async ({ db, params: { slug } }) => {
            const result = await db.delete(space).where(sql`slug=${slug}`);

            return result;
        })
}