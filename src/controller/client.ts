export async function fetchAllPages(
  bearer: string, 
  databaseId: string
) {
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

export async function fetchPage(
  bearer: string, 
  id: string
): Promise<Node<any>> {

  const response =
    await fetch(
      `https://notion-api.tech9065.workers.dev/page/${id}`,
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
  
  const data: any = await response.json();

  const node: Node<any> = {
    origin: {
      properties: data.origin?.properties,
      updatedAt: new Date(data.origin?.updatedAt),
    },
    id: data.id,
  };

  return node
}

export async function cacheImage(
  auth: string, 
  accountId: string, 
  url: string
) {
  const formData = new FormData()
  formData.append('url', url)
  const response =
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          Authorization: auth,
          'Content-Type': 'multipart/form-data-value',
        },
        body: formData
      }
    )
  return response
}
