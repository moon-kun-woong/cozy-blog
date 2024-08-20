import { Elysia, t, Static } from "elysia";
import { UUID, DateTime, pageResponse } from "./global";

export const SpaceState = t.Enum({
  NONE: "NONE",
  ACTIVATED: "ACTIVATED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED",
});

export const query = t.Object({
  id: t.Optional(t.Array(UUID)),
  uid: t.Optional(t.Array(t.String())),
  title: t.Optional(t.Array(t.String())),
  state: t.Optional(t.Array(SpaceState)),
  slug: t.Optional(t.Array(t.String())),
});

export const simple = t.Object({
  id: UUID,
  slug: t.String(),
  title: t.String(),
  state: SpaceState,
  uid: t.String(),
});

export const detail = t.Object({
  id: UUID,
  slug: t.String(),
  metaDatabaseId: UUID,
  postDatabaseId: UUID,
  title: t.String(),
  state: SpaceState,
  lastRefreshedAt: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime,
  uid: t.String(),
});

export const create = t.Object({
  slug: t.String({ minLength: 3, maxLength: 20 }),
  metaDatabaseId: UUID,
  postDatabaseId: UUID,
  title: t.String({ minLength: 3, maxLength: 40 }),
  uid: t.String(),
});

export const update = t.Object({
  title: t.Optional(t.String({ minLength: 3, maxLength: 40 })),
  state: t.Optional(SpaceState),
  metaDatabaseId: t.Optional(UUID),
  postDatabaseId: t.Optional(UUID),
});

export const availabilityQuery = t.Object({
  title: t.Optional(t.String()),
  slug: t.Optional(t.String()),
});

export type SpaceQuery = Static<typeof query>;
export type SpaceSimple = Static<typeof simple>;
export type SpaceDetail = Static<typeof detail>;
export type SpaceCreate = Static<typeof create>;
export type SpaceUpdate = Static<typeof update>;
export type SpaceAvailabilityQuery = Static<typeof availabilityQuery>;

export const spaceModel = new Elysia().model({
  query,
  simples: pageResponse(simple),
  detail,
  create,
  update,
  availabilityQuery,
});
