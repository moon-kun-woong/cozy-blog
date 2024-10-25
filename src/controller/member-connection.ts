import { eq } from "drizzle-orm";
import { memberConnection } from "../entity";
import { memberConnectionModel } from "../model/member-connection";
import { createBase } from "./util";
import { t } from "elysia";

export const memberConnectionController = createBase("member")
    .use(memberConnectionModel)
    .get(
        "/:userId/connection",
        async ({ db, params: { userId } }) => {

            const result = await db
                .select()
                .from(memberConnection)
                .where(eq(memberConnection.uid, userId))
                .all()

            const connctions = result.map(connection => ({
                ...connection,
                createdAt: connection.createdAt.toISOString(),
                updatedAt: connection.updatedAt.toISOString(),
            }));

            return connctions
        },
        {
            params: t.Object({
                userId: t.String()
            }),
            response: "member.details",
        },
    )

    .post(
        "/:userId/connection",
        async ({ db, params: { userId }, body }) => {
            const [result] = await db
                .insert(memberConnection)
                .values({
                    ...body,
                    uid: userId
                })
                .returning();

            const content = {
                ...result,
                createdAt: result.createdAt.toISOString(),
                updatedAt: result.updatedAt.toISOString(),
            }

            return content
        },
        {
            params: t.Object({
                userId: t.String()
            }),
            body: "member.create",
            response: "member.detail"
        }
    )

    .patch(
        "/:userId/connection",
        async ({ db, params: { userId }, body }) => {

            const [result] = await db
                .update(memberConnection)
                .set({ accessToken: body.accessToken })
                .where(eq(memberConnection.uid, userId))
                .returning()

            const content = {
                ...result,
                createdAt: result.createdAt.toISOString(),
                updatedAt: result.updatedAt.toISOString(),
            }

            return content
        },
        {
            params: t.Object({
                userId: t.String()
            }),
            body: "member.update",
            response: "member.detail"
        }
    )