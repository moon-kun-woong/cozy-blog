import Elysia, { Static, t } from "elysia";
import { DateTime } from "./global";

export const detail = t.Object({
    uid: t.String(),
    accessToken: t.String(),
    createdAt: DateTime,
    updatedAt: DateTime,
});

export const details = t.Array(
    t.Object({
        uid: t.String(),
        accessToken: t.String(),
        createdAt: DateTime,
        updatedAt: DateTime,
    }));

export const create = t.Object({
    uid: t.String(),
    accessToken: t.String(),
});

export const update = t.Object({
    accessToken: t.String(),
});

export type MemberDetial = Static<typeof detail>;
export type MemberCreate = Static<typeof create>;
export type MemberUpdate = Static<typeof update>;

export const memberConnectionModel = new Elysia().model({
    'member.detail': detail,
    'member.details': details,
    'member.create': create,
    'member.update': update,
});