import { generateApp } from './app'
import controllers from './domain/blog/controller/index'

export default {
  async fetch (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return await generateApp({env, controllers}).fetch(request)
  }
}