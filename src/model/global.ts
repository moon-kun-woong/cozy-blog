import { Static, t, TSchema } from "elysia";

export const UUID = t.String({ format: "uuid" });
export const DateTime = t.String({ format: "date-time" });

export const pageRequest = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  size: t.Optional(t.Number({ default: 20 })),
});

export const pageResponse = <T extends TSchema>(itemSchema: T) =>
  t.Object({
    content: t.Array(itemSchema),
    currentPage: t.Number(),
    totalPage: t.Number(),
    totalCount: t.Number(),
  });

export type PageRequest = Static<typeof pageRequest>;
export type PageResponse<T extends TSchema> = Static<
  ReturnType<typeof pageResponse<T>>
>;
