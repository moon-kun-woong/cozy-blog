export function json(body: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(body), { status });
}
