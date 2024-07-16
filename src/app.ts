import { Elysia } from "elysia";
import { setup } from "./setup";
import { drizzle } from 'drizzle-orm/d1'
import { space } from './domain/blog/entity/index'
import { sql } from 'drizzle-orm'

export function appStart(env: Env) {
	const app = new Elysia({ aot: false })
		.use(setup(env))
		.onError(errorHandler)

		.get("/space/:id", async (context) => {
			console.log(context.params.id);
			const db = drizzle(env.DB);
			const result = await db.select().from(space).where(sql`id=${context.params.id}`);

			return JSON.stringify({result: result, id: context.params.id});
		})

		.get("/space", async () => {
			const db = drizzle(env.DB);
			const result = await db.select().from(space).all();

			const resultJson = JSON.stringify(result);

			return JSON.parse(resultJson)
		})

		.post("/space", async (context) => {
			const contextBody = context.body;
			console.log(contextBody);

			const { uid, slug, metaDatabaseId, postDatabaseId, title, state }:any = contextBody;
			const db = drizzle(env.DB);
			const result = await db.insert(space).values([{ uid, slug, metaDatabaseId, postDatabaseId, title, state }]);
			const resultJson = JSON.stringify(result)

			return JSON.parse(resultJson);
		})

		.put("/space/:id", async (context) => {
			const id = context.params.id
			const contextBody = context.body
			const { uid, slug, metaDatabaseId, postDatabaseId, title, state }:any = contextBody;

			const db = drizzle(env.DB);
			const result = await db.update(space).set({ uid, slug, metaDatabaseId, postDatabaseId, title, state }).where(sql`id=${id}`);

			return JSON.stringify(result);
		})

		.delete("/space/:id", async (context) => {
			const id = context.params.id
			const db = drizzle(env.DB);
			const result = await db.delete(space).where(sql`id=${id}`);

			return result;
		})

	return app;
}

const errorHandler = ({ code, error }: { code: string, error: Error }): Response => {
	if (code === 'NOT_FOUND') {
		return new Response (`${code}, ${error}`)
	}
	console.error(code, error)
	return new Response (`${code} , ${error.message}`)
}