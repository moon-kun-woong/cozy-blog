import { t } from "elysia";
import { spaceModel, query, SpaceState } from "../model/space";
import { pageRequest, UUID } from "../model/global";
import { createBase } from "./util";
import { space } from "../entity";
import { count, eq, sql } from "drizzle-orm";

export const spaceController = createBase("space")
  .use(spaceModel)
  .get(
    "/",
    async ({ log, db, query }) => {
      log.debug(query);
      const currentPage = query.page ?? 1;
      const sizeNumber = query.size ?? 20;

      const offset = (currentPage - 1) * sizeNumber;

      const result = await db
        .select({
          id: space.id,
          uid: space.uid,
          title: space.title,
          slug: space.slug,
          state: space.state,
        })
        .from(space)
        .limit(parseInt(`${sizeNumber}`))
        .offset(offset)
        .all()

      const content = result.map(space => ({
        ...space,
        state: SpaceState.anyOf.at(space.state)?.const || 'NONE'
      }));

      const [totalCount] = await db
        .select({ count: count() })
        .from(space)

      return {
        content,
        currentPage: parseInt(`${currentPage}`),
        totalPage: Math.ceil(totalCount.count / sizeNumber),
        totalCount: totalCount.count
      };
    },
    {
      query: t.Composite([query, pageRequest]),
      response: "simples",
    },
  )
  .get(
    "/:slug",
    async ({ db, params: { slug } }) => {
      const [result] = await db
        .select()
        .from(space)
        .where(eq(space.slug, slug));

      const content = {
        ...result,
        state: SpaceState.anyOf.at(result.state)?.const || 'NONE',
        lastRefreshedAt: result.lastRefreshedAt.toISOString(),
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };

      return content;
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      response: "detail",
    },
  )
  .post("/", async ({ db, body }) => {
    const { uid, slug, title, metaDatabaseId, postDatabaseId } = body;

    const [result] = await db
      .insert(space)
      .values({
        id: crypto.randomUUID(),
        uid,
        slug,
        metaDatabaseId,
        postDatabaseId,
        title,
        lastRefreshedAt: new Date(),
      }).returning();

    const content = {
      ...result,
      state: SpaceState.anyOf.at(result.state)?.const || 'NONE',
      lastRefreshedAt: result.lastRefreshedAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    return content;
  },
    {
      body: "create",
      response: "detail",
    },
  )
  .put(
    "/:slug",
    async ({ db, params: { slug }, body }) => {
      const { metaDatabaseId, postDatabaseId, title, state } = body;

      const transformState = SpaceState.anyOf.findIndex(item => item.const === state)

      const [result] = await db
        .update(space)
        .set({
          title,
          state: transformState,
          metaDatabaseId,
          postDatabaseId,
        })
        .where(eq(space.slug, slug)).returning();

      const content = {
        ...result,
        state: SpaceState.anyOf.at(result.state)?.const || 'NONE',
        lastRefreshedAt: result.lastRefreshedAt.toISOString(),
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };

      return content;
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      body: "update",
      response: "detail",
    },
  )
  .delete(
    "/:slug",
    async ({ db, params: { slug } }) => {
      const result = await db
        .update(space)
        .set({ state: 3 })
        .where(eq(space.slug, slug))

      return result;
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    },
  )
  .post(
    "/:slug/refresh_action",
    ({ log, params: { slug }, body }) => {
      log.debug(slug);
      log.debug(body);

      // todo: Implement enqueueRefreshRequest logic
      return null;
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      body: t.Object({
        type: t.String(),
      }),
    },
  )
  .get(
    "/availability",
    async ({ log, db, query }) => {
      log.debug(query);
      const result = await db
        .select({
          title: space.title,
          slug: space.slug
        })
        .from(space)
        .all()

      const checkDuplicateTitle = result.length === 0 || result.map(space => space.title !== query.title)
      const checkDuplicateSlug = result.length === 0 || result.map(space => space.slug !== query.slug)

      if (checkDuplicateTitle == checkDuplicateSlug == checkSlug(query.slug)) {
        return true
      } else return false

    },
    {
      query: "availabilityQuery",
    },
  )
  .patch(
    "/:id",
    async ({ log, db, params: { id }, body }) => {
      log.debug(body);
      const { metaDatabaseId, postDatabaseId, title, state } = body;

      const transformState = SpaceState.anyOf.findIndex(item => item.const === state)
      const [result] = await db
        .update(space)
        .set({
          title,
          state: transformState,
          metaDatabaseId,
          postDatabaseId,
        })
        .where(sql`id=${id}`).returning();

      const content = {
        ...result,
        state: SpaceState.anyOf.at(result.state)?.const || 'NONE',
        lastRefreshedAt: result.lastRefreshedAt.toISOString(),
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };

      return content;
    },
    {
      params: t.Object({
        id: UUID,
      }),
      body: "update",
      response: "detail",
    },
  );

function checkSlug(slug: any): Boolean {
  const regex = new RegExp("^[a-zA-Z0-9가-힣\-_]+$")
  return regex.test(slug)
}