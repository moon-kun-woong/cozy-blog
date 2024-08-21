import { Elysia } from "elysia";
import { setup } from "./setup";
import { type Controller, type AnyElysia } from "./types"
import swagger from "@elysiajs/swagger";

export function generateApp({ env, controllers }: { env: Env, controllers: Controller[] }): AnyElysia {
	let app = new Elysia({ aot: false })
		.use(setup(env))
		.use(swagger({
			documentation: {
				info: {
					title: 'cozy-blog',
					version: '1.0.0'
				},
				tags: [
					{ name: 'space', description: 'space endpoints' },
					{ name: 'post', description: 'post endpoints' }
				]
			},
		}))
		.onError(errorHandler)

	controllers.forEach(({ prefix, register }) => { app = app.group(prefix, (app) => { return register(app) }) })

	return app;
}

const errorHandler = ({ code, error }: { code: string, error: Error }): Response => {
	if (code === 'NOT_FOUND') {
		return Response.json({ error })
	}
	console.error(code, error)
	return Response.json({ code, error })
}