import { generateApp } from "./app";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await generateApp({ env }).fetch(request);
  },
} satisfies ExportedHandler<Env>;
