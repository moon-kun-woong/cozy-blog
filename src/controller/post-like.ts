import { t } from "elysia";
import { postModel, likeQuery, PostLikeState } from "../model/post";
import { pageRequest, UUID } from "../model/global";
import { createBase } from "./util";
import { post, postLike } from "../entity";
import { count, eq } from "drizzle-orm";

export const postLikeController = createBase("post_like")
  .use(postModel)
  .get(
    "/",
    async ({ db, log, query }) => {
      log.debug(query);
      const currentPage = query.page ?? 1;
      const sizeNumber = query.size ?? 20;

      const result = await db
        .select({
          id: postLike.id,
          state: postLike.state,
          spaceId: postLike.spaceId,
          postId: postLike.postId,
          createdAt: postLike.createdAt,
          updatedAt: postLike.updatedAt,
        })
        .from(postLike)
        .all()

      const content = result.map(postLike => ({
        ...postLike,
        state: PostLikeState.anyOf.at(postLike.state)?.const || 'NONE',
        createdAt: postLike.createdAt.toISOString(),
        updatedAt: postLike.updatedAt.toISOString(),
      }))


      const [totalCount] = await db
        .select({ count: count() })
        .from(post)


      return {
        content,
        currentPage: parseInt(`${currentPage}`),
        totalPage: Math.ceil(totalCount.count / sizeNumber),
        totalCount: totalCount.count
      };
    },
    {
      query: t.Composite([likeQuery, pageRequest]),
      response: "post.likeSimples",
    },
  )
  .get(
    "/:id",
    async ({ log, db, params: { id } }) => {
      log.debug(id);

      const [result] = await db
        .select({
          id: postLike.id,
          state: postLike.state,
          spaceId: postLike.spaceId,
          postId: postLike.postId,
          createdAt: postLike.createdAt,
          updatedAt: postLike.updatedAt,
        })
        .from(postLike)
        .where(eq(postLike.id, id))

      const content = {
        ...result,
        state: PostLikeState.anyOf.at(result.state)?.const || 'NONE',
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      }

      return content;
    },
    {
      params: t.Object({
        id: UUID,
      }),
      response: "post.likeDetail",
    },
  )
  .post(
    "",
    async ({ log, db, body }) => {
      log.debug(body);
      const { postId, spaceId } = body;

      const [result] = await db
        .insert(postLike)
        .values({
          id: crypto.randomUUID(),
          postId,
          spaceId
        }).returning();

      const content = {
        ...result,
        state: PostLikeState.anyOf.at(result.state)?.const || 'NONE',
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      }


      return content;
    },
    {
      body: "post.likeCreate",
      response: "post.likeDetail",
    },
  )
  .put(
    "/:id",
    async ({ log, db, params: { id }, body }) => {
      log.debug(id);
      log.debug(body);

      const { spaceId, postId, state } = body;

      const transformState = PostLikeState.anyOf.findIndex(item => item.const === state)

      const [result] = await db
        .update(postLike)
        .set({
          spaceId,
          postId,
          state: transformState
        })
        .where(eq(postLike.id, id)).returning();

      const content = {
        ...result,
        state: PostLikeState.anyOf.at(result.state)?.const || 'NONE',
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      }

      return content;
    },
    {
      params: t.Object({
        id: UUID,
      }),
      body: "post.likeUpdate",
      response: "post.likeDetail",
    },
  );
