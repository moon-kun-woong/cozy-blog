
export async function notionProxyController(bearer: string, databaseId: string) {

  const response =
    await fetch(
      `https://notion-api.tech9065.workers.dev/database/${databaseId}/page`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
        },
      })
  if (!response.ok) {
    throw new Error(`페이지를 가져오는데 실패했습니다: ${response.statusText}`);
  }

  return response
}
