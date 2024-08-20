import { Elysia, t, Static } from "elysia";
import { UUID, DateTime, pageResponse } from "./global";

export const MetaTitle = t.Enum({
  NONE: "NONE",
  HOME: "HOME",
  ABOUT: "ABOUT",
  PROFILE: "PROFILE",
});

export const MetaImageCategory = t.Enum({
  NONE: "NONE",
  MAIN: "MAIN",
  SUB: "SUB",
});

const image = t.Object({
  category: MetaImageCategory,
  url: t.String(),
  seq: t.Number(),
});

const space = t.Object({
  id: UUID,
  slug: t.String(),
});

export const query = t.Object({
  id: t.Optional(t.Array(UUID)),
  title: t.Optional(t.Array(MetaTitle)),
  spaceId: t.Optional(t.Array(UUID)),
  spaceSlug: t.Optional(t.Array(t.String())),
  space: t.Optional(t.Array(t.String())),
});

export const simple = t.Object({
  id: UUID,
  title: MetaTitle,
  updatedAt: DateTime,
  images: t.Array(image),
  space,
  spaceSlug: t.String(),
});

export const detail = t.Object({
  id: UUID,
  title: MetaTitle,
  content: t.Any(),
  updatedAt: DateTime,
  images: t.Array(image),
  space,
});

export type MetaQuery = Static<typeof query>;
export type MetaSimple = Static<typeof simple>;
export type MetaDetail = Static<typeof detail>;

export const metaModel = new Elysia().model({
  query,
  simples: pageResponse(simple),
  detail,
});
