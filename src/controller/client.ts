
export async function notionProxyController(bearer: string, postDatabaseId: string) {

  const fetchAllPages =
    await fetch(
      `https://notion-api.tech9065.workers.dev/database/${postDatabaseId}/page`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
        },
      })

  return fetchAllPages
}
