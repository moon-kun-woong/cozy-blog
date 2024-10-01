import { error, t } from "elysia";
import { refreshRequestModel, query } from "../model/refresh-request";
import { pageRequest } from "../model/global";
import { createBase } from "./util";
import { memberConnection, post, space } from "../entity";
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
      response: "simples",
    },
  )
  .post(
    "/",
    async ({ log, db, body }) => {
      log.debug(body);
      if (body.sourceType != "SPACE" && body.space != null) {
        log.error(`Type(${body.sourceType}) was not supported.`)
        return error("Bad Request")
      }

      if (!body.space) {
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

      log.info("=-=======================")
      log.info(accessToken)
      log.info(fetchedSpace)

      // notion postPage 를 불러오는 함수 작성할 것.
      const nodes = fetchPageNodes(accessToken.accessToken, fetchedSpace);

      // fetchedSpace.postDatabaseId.map(node => {
      //   if (node.id == nodes.id.toString()) {
      //     node.state = 3
      //   }
      // });

      // const refreshRequests = checkNewOrUpdated(nodes, fetchedSpace)

      // const result = db
      //   .insert(space)
      //   .values()
      //   .returning()


      return nodes;
    },
    {
      body: "create",
    },
  );

async function fetchPageNodes(bearer: string, posts: any): Promise<Array<any>> {
  const postTask = await notionProxyController(bearer, posts.postDatabaseId)
  console.log("체크 페이지올포스트")
  console.log(postTask)

  const metaTask = await notionProxyController(bearer, posts.metaDatabaseId)

  const postResults = postTask.map((post: any) => new PostNodeWrapper(post))
  const metaResults = metaTask.map((meta: any) => new MetaNodeWrapper(meta))

  return [...postResults, ...metaResults]
}

function checkNewOrUpdated(node: any, posts: any) {
  const pageId = node.id
  const updatedAt = posts.map(post => {
    if (post.id.toString() == pageId) {
      post.updated_at
    }
  })
  return updatedAt
}

interface PostNodeWrapper {

}