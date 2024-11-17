import { error, t } from "elysia";
import { postModel, query, PostState } from "../model/post";
import { pageRequest } from "../model/global";
import { createBase } from "./util";
import { post, postContent, space } from "../entity";
import { count, eq } from "drizzle-orm";

export const postController = createBase("post")
  .use(postModel)
  .get(
    "/",
    async ({ log, db, query }) => {
      log.debug(query);
      const currentPage = query.page ?? 1;
      const sizeNumber = query.size ?? 20;

      const offset = (currentPage - 1) * sizeNumber;

      const result = await db
        .select({
          id: post.id,
          state: post.state,
          slug: post.slug,
          title: post.title,
          tags: post.tags,
          description: post.description,
          thumbnail: post.thumbnail,
          updatedAt: post.updatedAt,
          space: {
            name: space.title,
            slug: space.slug,
            id: space.id
          },
          spaceSlug: space.slug,
          spaceName: space.title,
        })
        .from(post)
        .innerJoin(space, eq(post.spaceId, space.id))
        .limit(parseInt(`${sizeNumber}`))
        .offset(offset)
        .all()

      const content = result.map(post => ({
        ...post,
        viewCount: 1, // 아직 작성되지 않은 코드 (plausible::getPageViewCounts)
        updatedAt: post.updatedAt.toISOString(),
        state: PostState.anyOf.at(post.state)?.const || 'NONE'
      }));

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
      query: t.Composite([query, pageRequest]),
      response: "post.simples",
    },
  )
  .get(
    "/:id",
    async ({ log, db, params: { id } }) => {
      const [result] = await db
        .select({
          id: post.id,
          state: post.state,
          content: {
            id: postContent.id,
            postId: postContent.postId,
            json: postContent.json
          },
          slug: post.slug,
          title: post.title,
          tags: post.tags,
          description: post.description,
          thumbnail: post.thumbnail,
          spaceSlug: space.slug,
          spaceName: space.title,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          space: {
            name: space.title,
            slug: space.slug,
            id: space.id
          }
        })
        .from(post)
        .where(eq(post.id, id))
        .innerJoin(space, eq(post.spaceId, space.id))
        .innerJoin(postContent, eq(post.id, postContent.postId));

      const content = {
        ...result,
        viewCount: 1, // 아직 작성되지 않은 코드 (plausible::getPageViewCounts)
        state: PostState.anyOf.at(result.state)?.const || 'NONE',
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };

      return content;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: "post.detail",
    },
  )