import { error, t } from "elysia";
import { refreshRequestModel, query, RefreshRequestType, RefreshRequestSourceType, RefreshRequestState } from "../model/refresh-request";
import { pageRequest } from "../model/global";
import { createBase } from "./util";
import { memberConnection, meta, post, refreshRequest, space } from "../entity";
import { eq } from "drizzle-orm";
import { notionProxyController } from "./client";

export const refreshRequestController = createBase("refresh_request")
  .use(refreshRequestModel)
  .get(
    "",
    ({ log, query }) => {
      log.debug(query);
      // todo: Implement findAll logic
      return {
        content: [
          {
            id: "00000000-0000-0000-0000-000000000000",
            spaceId: "00000000-0000-0000-0000-000000000000",
            sourceType: "SPACE",
            pageId: "00000000-0000-0000-0000-000000000000",
            type: "POST",
            state: "TODO",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        currentPage: 1,
        totalPage: 1,
        totalCount: 1,
      };
    },
    {
      query: t.Composite([query, pageRequest]),
      response: "refreshRequest.simples",
    },
  )
  .post(
    "/",
    async ({ log, db, body }) => {
      log.debug(body);
      if (body.sourceType != RefreshRequestSourceType.SPACE) {
        log.error(`Type(${body.sourceType}) was not supported.`)
        return error("Bad Request")
      }

      if (!body.space || body.space == null) {
        log.error("Space slug is missing.");
        return error("Bad Request");
      }

      const [fetchedSpace] = await db
        .select()
        .from(space)
        .where(eq(space.slug, body.space));

      const [accessToken] = await db
        .select({ accessToken: memberConnection.accessToken })
        .from(memberConnection)
        .where(eq(memberConnection.uid, fetchedSpace.uid));

      const fetchPosts = await db
        .select()
        .from(post)
        .where(eq(post.spaceId, fetchedSpace.id))

      const nodes = await fetchPageNodes(accessToken.accessToken, fetchedSpace);

      fetchPosts
        .filter(post => nodes.every(node => node.id !== post.id.toString()))
        .forEach(it => db.update(post).set({ state: 3 }).where(eq(post.id, it.id)))

      const refreshRequests = nodes
        .filter(node => checkNewOrUpdated(node, space))
        .map(node => ({
          id: crypto.randomUUID(),
          spaceId: fetchedSpace.id,
          sourceType: RefreshRequestSourceType.SPACE,
          pageId: node.id,
          type: node.RefreshRequestType,
          state: RefreshRequestState.TODO,
          createdAt: new Date,
          updatedAt: new Date,
        }))

      const [addRefreshRequest] = await db
        .insert(refreshRequest)
        .values(refreshRequests)
        .returning()

      const result = {
        ...addRefreshRequest,
        type: RefreshRequestType.anyOf.at(addRefreshRequest.type)?.const || 'NONE',
        state: RefreshRequestState.anyOf.at(addRefreshRequest.state)?.const || 'NONE',
        sourceType: RefreshRequestSourceType.anyOf.at(addRefreshRequest.sourceType)?.const || 'NONE',
        createdAt: addRefreshRequest.createdAt.toISOString(),
        updatedAt: addRefreshRequest.updatedAt.toISOString(),
      }

      return result;
    },
    {
      body: "refreshRequest.create",
    },
  );

async function fetchPageNodes(bearer: string, space: any): Promise<any[]> {
  const postResponse = await notionProxyController(bearer, space.postDatabaseId);
  const metaResponse = await notionProxyController(bearer, space.metaDatabaseId);

  const postTask = await postResponse.json() as any
  const metaTask = await metaResponse.json() as any

  return [...postTask, ...metaTask]
}

function checkNewOrUpdated(node: any, spaceNode: typeof space): Boolean {
  const pageId = node.id
  let updatedAt = null

  if (spaceNode.postDatabaseId === pageId.id) {
    updatedAt = post.updatedAt ?? null
  }
  else if (spaceNode.metaDatabaseId === pageId.id) {
    updatedAt = meta.updatedAt ?? null
  }

  return updatedAt === null || updatedAt > updatedAt

}
