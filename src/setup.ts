import { logger } from "./plugins";
import cors from "@elysiajs/cors";
import { drizzle } from "drizzle-orm/d1";
import Elysia, { type ElysiaConfig } from "elysia";

export type Config = ElysiaConfig<string, false>;

export function setup(env: Env) {
  const config: Config = { name: "setup" };
  return new Elysia(config)
    .decorate("db", drizzle(env.DB, { logger: true }))
    .use(cors())
    .use(logger({ autoLogging : false }));
}
