import { Elysia, t, Static } from "elysia";
import { UUID, DateTime, pageResponse } from "./global";

export const RefreshRequestSourceType = t.Enum({
  NONE: "NONE",
  SPACE: "SPACE",
  POST: "POST",
  META: "META",
});

export const RefreshRequestType = t.Enum({
  NONE: "NONE",
  POST: "POST",
  META: "META",
});

export const RefreshRequestState = t.Enum({
  NONE: "NONE",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  FAIL: "FAIL",
  CANCELED: "CANCELED",
  TERMINATED: "TERMINATED",
});

export const query = t.Object({
  space: t.Optional(t.String()),
  state: t.Optional(t.Array(RefreshRequestState)),
});

export const simple = t.Object({
  id: UUID,
  spaceId: UUID,
  sourceType: RefreshRequestSourceType,
  pageId: UUID,
  type: RefreshRequestType,
  state: RefreshRequestState,
  createdAt: DateTime,
  updatedAt: DateTime,
});

export const create = t.Object({
  space: t.Optional(t.String()),
  page: t.Optional(t.String()),
  sourceType: RefreshRequestSourceType,
});

export type RefreshRequestQuery = Static<typeof query>;
export type RefreshRequestSimple = Static<typeof simple>;
export type RefreshRequestCreate = Static<typeof create>;

export const refreshRequestModel = new Elysia().model({
  "refreshRequest.query": query,
  "refreshRequest.simples": pageResponse(simple),
  "refreshRequest.create": create,
});
