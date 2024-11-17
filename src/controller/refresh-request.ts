import { error, t } from "elysia";
import { refreshRequestModel, query, RefreshRequestType, RefreshRequestSourceType, RefreshRequestState } from "../model/refresh-request";
import { DateTime, pageRequest } from "../model/global";
import { createBase } from "./util";
import { memberConnection, meta, post, refreshRequest, space } from "../entity";
import { count, eq } from "drizzle-orm";
import { fetchAllPages, fetchPage } from "./client";
import { scanAndCache } from "./image-asset-handler";

export const refreshRequestController = createBase("refresh_request")
  .use(refreshRequestModel)
  .get(
    "/",
    async ({ db, log, query }) => {
      log.debug(query);
      const currentPage = query.page ?? 1;
      const sizeNumber = query.size ?? 20;

      const offset = (currentPage - 1) * sizeNumber;

      const result = await db
        .select({
          id: refreshRequest.id,
          spaceId: refreshRequest.spaceId,
          sourceType: refreshRequest.sourceType,
          pageId: refreshRequest.pageId,
          type: refreshRequest.type,
          state: refreshRequest.state,
          createdAt: refreshRequest.createdAt,
          updatedAt: refreshRequest.updatedAt,
        })
        .from(refreshRequest)
        .limit(parseInt(`${sizeNumber}`))
        .offset(offset)
        .all()

      const content = result.map(refreshRequest => ({
        ...refreshRequest,
        sourceType: RefreshRequestSourceType.anyOf.at(refreshRequest.sourceType)?.const || 'NONE',
        type: RefreshRequestType.anyOf.at(refreshRequest.type)?.const || 'NONE',
        state: RefreshRequestState.anyOf.at(refreshRequest.state)?.const || 'NONE',
        createdAt: refreshRequest.createdAt.toISOString(),
        updatedAt: refreshRequest.updatedAt.toISOString(),
      }));

      const [totalCount] = await db
        .select({ count: count() })
        .from(refreshRequest)

      return {
        content,
        currentPage: parseInt(`${currentPage}`),
        totalPage: Math.ceil(totalCount.count / sizeNumber),
        totalCount: totalCount.count
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
        .where(eq(
          space.slug,
          body.space
        ));

      const [accessToken] = await db
        .select({ accessToken: memberConnection.accessToken })
        .from(memberConnection)
        .where(eq(
          memberConnection.uid,
          fetchedSpace.uid
        ));

      const fetchPosts = await db
        .select()
        .from(post)
        .where(eq(
          post.spaceId,
          fetchedSpace.id
        ));

      const nodes = await fetchPageNodes(accessToken.accessToken, fetchedSpace);

      fetchPosts
        .filter(post => nodes.every(node => node.id !== post.id.toString()))
        .forEach(it => db
          .update(post)
          .set({ state: 3 })
          .where(eq(
            post.id,
            it.id
          ))
        );

      const refreshRequests = nodes
        .filter(it =>
          checkNewOrUpdated(it, space)
        )
        .map(it => ({
          id: crypto.randomUUID(),
          spaceId: fetchedSpace.id,
          sourceType: RefreshRequestSourceType.SPACE,
          pageId: it.id,
          type: it.RefreshRequestType,
          state: RefreshRequestState.TODO,
          createdAt: new Date,
          updatedAt: new Date,
        }));

      const [addRefreshRequest] = await db
        .insert(refreshRequest)
        .values(refreshRequests)
        .returning();

      async function processRefreshRequest(id: string, timestamp: Date) {
        if (Date.now() > timestamp.getTime() + (30 * 60 * 1000)) {
          throw error("Expectation Failed", `Refresh request (${timestamp} - ${id}) expired.`)
        }
        const [targetRefreshRequest] = await db
          .select()
          .from(refreshRequest)
          .where(eq(
            refreshRequest.id,
            id
          ));

        const [targetSpace] = await db
          .select()
          .from(space)
          .where(eq(
            space.id,
            targetRefreshRequest.spaceId
          ));

        targetRefreshRequest.state = RefreshRequestState.IN_PROGRESS;
        targetSpace.lastRefreshedAt = new DateTime.now();

        await db.transaction(
          async (tx) => {
            await tx
              .update(refreshRequest)
              .set({
                state: targetRefreshRequest.state,
              })
              .where(eq(
                refreshRequest.id,
                targetRefreshRequest.id
              ));

            await tx
              .update(space)
              .set({
                lastRefreshedAt: targetSpace.lastRefreshedAt
              })
              .where(eq(
                space.id,
                targetRefreshRequest.spaceId
              ));
          }
        );

        try {
          log.debug(`Start to process refresh request: ${targetRefreshRequest}`);
          let page
          try {
            page = await fetchPage(
              accessToken.accessToken,
              targetRefreshRequest.pageId
            );
          } catch (error) {
            log.error(`Fail to fetch page in refresh request process : ${targetRefreshRequest}`);
            targetRefreshRequest.state = RefreshRequestState.FAIL;
            throw error
          }

          const replacedPage = () => {
            try {
              const cachedPage = scanAndCache(Object(page));
              log.debug(`Finish image cache process: ${targetRefreshRequest}`);
              return cachedPage
            } catch (error) {
              log.error(`Fail to cache image of page in refresh request process : ${refreshRequest}`);
              targetRefreshRequest.state = RefreshRequestState.FAIL;
              throw error;
            }
          }

          try {
            const page = Object(await replacedPage())

            const replacedSpace = {
              id: page.id,
              uid: page.uid,
              slug: page.slug,
              metaDatabaseId: page.metaDatabaseId,
              postDatabaseId: page.postDatabaseId,
              title: page.title,
              state: page.state,
              lastRefreshedAt: page.lastRefreshedAt,
              createdAt: page.createdAt,
              updatedAt: page.updatedAt,
            }

            if (targetRefreshRequest.type === RefreshRequestState.POST) {

              await db
                .update(space)
                .set(replacedSpace)
                .where(eq(space.id, page.spaceId))
              const [refreshPost] = await db.select().from(post).where(eq(post.spaceId, replacedSpace.id))
              if (refreshPost !== undefined) {
                await db
                  .delete(post)
                  .where(eq(
                    post.spaceId,
                    replacedSpace.id
                  ))
              }
              await db
                .insert(post)
                .values(page.post)
                .returning()
            }
            else if (targetRefreshRequest.type === RefreshRequestState.META) {
              // 아직 안만들어진 녀석인거 같은데?
            }
            else {
              throw error("Expectation Failed")
            }
            log.debug(`Done to process refresh request: ${targetRefreshRequest}`);
            targetRefreshRequest.state = RefreshRequestState.DONE;

          } catch (error) {
            log.error(`Fail to refresh request(${refreshRequest})`);
            targetRefreshRequest.state = RefreshRequestState.FAIL;
            throw error;
          }
        } finally {
          // targetRefvreshRequest 저장
        }

      }

      processRefreshRequest(addRefreshRequest.id, addRefreshRequest.createdAt);

      const result = {
        ...addRefreshRequest,
        type: RefreshRequestType.anyOf.at(addRefreshRequest.type)?.const || 'NONE',
        state: RefreshRequestState.anyOf.at(addRefreshRequest.state)?.const || 'NONE',
        sourceType: RefreshRequestSourceType.anyOf.at(addRefreshRequest.sourceType)?.const || 'NONE',
        createdAt: addRefreshRequest.createdAt.toISOString(),
        updatedAt: addRefreshRequest.updatedAt.toISOString(),
      };

      return result;
    },
    {
      body: "refreshRequest.create",
    },
  );

async function fetchPageNodes(bearer: string, space: any) {
  const postResponse = await fetchAllPages(bearer, space.postDatabaseId);
  const metaResponse = await fetchAllPages(bearer, space.metaDatabaseId);

  const postTask = Object(postResponse);
  const metaTask = Object(metaResponse);

  return [...postTask, ...metaTask];
}

function checkNewOrUpdated(node: Node, spaceNode: typeof space): Boolean {
  const pageId = node.id;
  let updatedAt = node.origin.updatedAt;

  if(typeof node.origin.properties == PostNode ){

  }

  return updatedAt === null || updatedAt > updatedAt;

}
