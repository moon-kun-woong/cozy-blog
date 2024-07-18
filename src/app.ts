import { Elysia } from "elysia";
import { setup } from "./setup";
import { type Controller, type AnyElysia } from "./types"

export function generateApp({ env, controllers }: { env: Env, controllers: Controller[] }): AnyElysia {
	let app = new Elysia({ aot: false })
		.use(setup(env))
		.onError(errorHandler)

	controllers.forEach(({ prefix, register }) => { app = app.group(prefix, (app) => { return register(app) }) })

	return app;
}

const errorHandler = ({ code, error }: { code: string, error: Error }): Response => {
	if (code === 'NOT_FOUND') {
		return Response.json({error})
	}
	console.error(code, error)
	return Response.json({code, error})
}