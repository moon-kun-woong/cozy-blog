import Elysia from "elysia";
import { json } from "./lib/util/http";
import { setup } from "./setup";
import controllers from "./controller";
import { type AnyElysia } from "./type";
import swagger from "@elysiajs/swagger";

export function generateApp({ env }: { env: Env }): AnyElysia {
  const app = new Elysia({ aot: false })
    .use(setup(env))
    .use(swagger()) // Swagger plugin must be registed in root.
    .onError(errorHandler);

  controllers.forEach((controller) => {
    app.use(controller);
  });

  return app;
}

const errorHandler = ({
  code,
  error,
}: {
  code: string;
  error: Error;
}): Response => {
  if (code === "NOT_FOUND") {
    return json({ code, message: "Route not found" }, 404);
  }
  if (code === "VALIDATION"){
    return json({ code, message: "Bad request. check validate error"}, 400)
  }
  console.error(code, error);
  return json({ code, message: error.message }, 500);
};
