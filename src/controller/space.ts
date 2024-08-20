import { t } from "elysia";
import { spaceModel, query } from "../model/space";
import { pageRequest, UUID } from "../model/global";
import { createBase } from "./util";

export const spaceController = createBase("space")
  .use(spaceModel)
  .get(
    "",
    ({ log, query }) => {
      log.debug(query);
      // todo: Implement findAll logic
      return {
        content: [
          {
            id: "00000000-0000-0000-0000-000000000000",
            uid: "00000000-0000-0000-0000-000000000000",
            slug: "dummy-slug",
            title: "Dummy Space",
            state: "ACTIVATED",
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
  .get(
    "/:slug",
    ({ params: { slug } }) => {
      // todo: Implement find logic
      return {
        id: "00000000-0000-0000-0000-000000000000",
        slug: slug,
        metaDatabaseId: "00000000-0000-0000-0000-000000000000",
        postDatabaseId: "00000000-0000-0000-0000-000000000000",
        title: "Dummy Space",
        state: "ACTIVATED",
        lastRefreshedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uid: "dummy-uid",
      };
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      response: "detail",
    },
  )
  .post(
    "",
    ({ body }) => {
      // todo: Implement create logic
      return {
        id: "00000000-0000-0000-0000-000000000000",
        ...body,
        state: "ACTIVATED",
        lastRefreshedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    {
      body: "create",
      response: "detail",
    },
  )
  .put(
    "/:slug",
    ({ log, params: { slug }, body }) => {
      log.debug(body);
      // todo: Implement update logic
      return {
        id: "00000000-0000-0000-0000-000000000000",
        title: "Dummy Space",
        state: "ACTIVATED",
        slug: slug,
        metaDatabaseId: "00000000-0000-0000-0000-000000000000",
        postDatabaseId: "00000000-0000-0000-0000-000000000000",
        lastRefreshedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uid: "dummy-uid",
      };
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
    ({ log, params: { slug } }) => {
      log.debug(slug);
      // todo: Implement delete logic
      return null;
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
    ({ log, query }) => {
      log.debug(query);
      // todo: Implement checkAvailability logic
      return true;
    },
    {
      query: "availabilityQuery",
    },
  )
  .patch(
    "/:id",
    ({ log, params: { id }, body }) => {
      log.debug(body);
      // todo: Implement update logic
      return {
        id: id,
        title: "Dummy Space",
        state: "ACTIVATED",
        slug: "dummy-slug",
        metaDatabaseId: "00000000-0000-0000-0000-000000000000",
        postDatabaseId: "00000000-0000-0000-0000-000000000000",
        lastRefreshedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uid: "dummy-uid",
      };
    },
    {
      params: t.Object({
        id: UUID,
      }),
      body: "update",
      response: "detail",
    },
  );
