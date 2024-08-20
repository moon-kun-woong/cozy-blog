import { t } from "elysia";
import { postModel, query } from "../model/post";
import { pageRequest, UUID } from "../model/global";
import { createBase } from "./util";

export const postController = createBase("post")
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
            state: "PUBLISHED",
            slug: "dummy-post",
            title: "Dummy Post",
            tags: "tag1,tag2",
            description: "This is a dummy post",
            thumbnail: "https://example.com/thumbnail.jpg",
            viewCount: 0,
            updatedAt: new Date().toISOString(),
            space: {
              name: "Dummy Space",
              slug: "dummy-space",
              id: "00000000-0000-0000-0000-000000000000",
            },
            spaceSlug: "dummy-space",
            spaceName: "Dummy Space",
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
    "/:id",
    ({ log, params: { id } }) => {
      log.debug(id);
      // todo: Implement find logic
      return {
        id: id,
        state: "PUBLISHED",
        content: {},
        slug: "dummy-post",
        title: "Dummy Post",
        tags: "tag1,tag2",
        description: "This is a dummy post",
        thumbnail: "https://example.com/thumbnail.jpg",
        viewCount: 0,
        spaceSlug: "dummy-space",
        spaceName: "Dummy Space",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        space: {
          name: "Dummy Space",
          slug: "dummy-space",
          id: "00000000-0000-0000-0000-000000000000",
        },
      };
    },
    {
      params: t.Object({
        id: UUID,
      }),
      response: "detail",
    },
  );
