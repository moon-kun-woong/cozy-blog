import { App } from "../../../types";
import { post, postContent, space } from '../../../domain/blog/entity/index'
import { count, eq } from 'drizzle-orm'
import { postModel } from "../models/post";
import { error } from "elysia";

export default function (app: App): any {
    return app
        .use(postModel)
        .get("/", async ({ db, query }) => {
            const currentPage = parseInt(query.page ?? '0');
            const sizeNumber = parseInt(query.size ?? '20');

            const offset = currentPage * sizeNumber;

            const content = await db
                .select({
                    id: post.id,
                    state: post.state,
                    slug: post.slug,
                    title: post.title,
                    tags: post.tags,
                    description: post.description,
                    thumbnail: post.thumbnail,
                    updatedAt: post.updatedAt,
                    space: {
                        id: space.id,
                        name: space.uid,
                        slug: space.slug
                    }
                })
                .from(post)
                .innerJoin(space, eq(post.spaceId, space.id))
                .limit(sizeNumber)
                .offset(offset)
                .all()

            nullCheck(content);

            const [totalCount] = await db
                .select({ count: count() })
                .from(post)

            return {
                content,
                currentPage,
                totalPage: Math.ceil(totalCount.count / sizeNumber),
                totalCount: totalCount.count
            }
        }, { response: "simples", query: "pageQuery", detail: { tags: ['post'] } })

        .get("/:id", async ({ db, params: { id } }) => {

            const [postResult] = await db
                .select({
                    id: post.id,
                    state: post.state,
                    content: {
                        id: postContent.id,
                        postId: postContent.postId
                    },
                    slug: post.slug,
                    title: post.title,
                    tags: post.tags,
                    description: post.description,
                    thumbnail: post.thumbnail,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    space: {
                        id: space.id,
                        name: space.uid,
                        slug: space.slug
                    }
                })
                .from(post)
                .where(eq(post.id, id))
                .innerJoin(space, eq(post.spaceId, space.id))
                .innerJoin(postContent, eq(post.id, postContent.postId))

            return postResult;
        }, { response: "detail", detail: { tags: ['post'] } })
}

function nullCheck(posts : any) {
    for (const post of posts) {
        if (post.space.id == null) {
            console.error("Unprocessable Content: spaceId is null", 405);
            throw error("Unprocessable Content");
        }
    }
}