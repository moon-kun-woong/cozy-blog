import { t } from "elysia";
import { postModel, likeQuery } from "../model/post";
import { pageRequest, UUID } from "../model/global";
import { createBase } from "./util";

export const postLikeController = createBase("post_like")
  .use(postModel)
  .get(
    "",
    ({ log, query }) => {
      log.debug(query);
      // todo: Implement findAll logic
      return {
        content: [
          {
            id: "00000000-0000-0000-0000-000000000000",
            state: "EXISTED",
            spaceId: "00000000-0000-0000-0000-000000000000",
            postId: "00000000-0000-0000-0000-000000000000",
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
      query: t.Composite([likeQuery, pageRequest]),
      response: "likeSimples",
    },
  )
  .get(
    "/:id",
    ({ log, params: { id } }) => {
      log.debug(id);
      // todo: Implement find logic
      return {
        id: id,
        state: "EXISTED",
        spaceId: "00000000-0000-0000-0000-000000000000",
        postId: "00000000-0000-0000-0000-000000000000",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    {
      params: t.Object({
        id: UUID,
      }),
      response: "likeDetail",
    },
  )
  .post(
    "",
    ({ log, body }) => {
      log.debug(body);
      // todo: Implement create logic
      return {
        id: "00000000-0000-0000-0000-000000000000",
        state: "EXISTED",
        spaceId: "00000000-0000-0000-0000-000000000000",
        postId: "00000000-0000-0000-0000-000000000000",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    {
      body: "likeCreate",
      response: "likeDetail",
    },
  )
  .put(
    "/:id",
    ({ log, params: { id }, body }) => {
      log.debug(id);
      log.debug(body);
      // todo: Implement update logic
      return {
        id: id,
        state: "EXISTED",
        spaceId: "00000000-0000-0000-0000-000000000000",
        postId: "00000000-0000-0000-0000-000000000000",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    {
      params: t.Object({
        id: UUID,
      }),
      body: "likeUpdate",
      response: "likeDetail",
    },
  );
