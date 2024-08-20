import { t } from "elysia";
import { refreshRequestModel, query } from "../model/refresh-request";
import { pageRequest } from "../model/global";
import { createBase } from "./util";

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
    "",
    ({ log, body }) => {
      log.debug(body);
      // todo: Implement create logic
      return null;
    },
    {
      body: "create",
    },
  );
