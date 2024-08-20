export async function resolveBodyToJson<T> (response: Response): Promise<T> {
  return await response.json() as T
}
