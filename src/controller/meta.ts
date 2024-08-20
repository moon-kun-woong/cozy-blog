import { t } from "elysia";
import { metaModel, query } from "../model/meta";
import { pageRequest, UUID } from "../model/global";
import { createBase } from "./util";

export const metaController = createBase("meta")
  .use(metaModel)
  .get(
    "",
    ({ log, query }) => {
      log.debug(query);
      // todo: Implement findAll logic
      return {
        content: [
          {
            id: "00000000-0000-0000-0000-000000000000",
            title: "HOME",
            updatedAt: new Date().toISOString(),
            images: [
              {
                category: "MAIN",
                url: "https://example.com/image.jpg",
                seq: 1,
              },
            ],
            space: {
              id: "00000000-0000-0000-0000-000000000000",
              slug: "dummy-space",
            },
            spaceSlug: "dummy-space",
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
        title: "HOME",
        content: {},
        updatedAt: new Date().toISOString(),
        images: [
          {
            category: "MAIN",
            url: "https://example.com/image.jpg",
            seq: 1,
          },
        ],
        space: {
          id: "00000000-0000-0000-0000-000000000000",
          slug: "dummy-space",
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
