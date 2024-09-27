import { SELF, env } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import type { PageResponse as PR } from "../src/model/global";
import {
    simple,
    PostDetail,
    PostState,
} from "../src/model/post";
import { resolveBodyToJson } from "./util";
import { post, postContent, space } from "../src/entity";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { SpaceState } from "../src/model/space";

describe("Post API test", () => {
    type PageResponse = PR<typeof simple>;

    it("Should success to request posts", async () => {
        const testSpace = await createSpace(
            "test_uid",
            "test_space_slug",
            "test_space_title",
        )
        const testPost = await createPost(
            testSpace.id.toString(),
            "test_slug",
            "test_title",
            "test_tags",
            "test_description",
            "test_thumbnail",
        );

        const testPostContent = await createPostConetent(
            testPost.id.toString(),
            "test_contentId",
            "{}"
        )

        const response = await SELF.fetch("https://example.com/post");
        const body = await resolveBodyToJson<PageResponse>(response);

        expect(response.status).toBe(200);
        expect(body.content.length).toBeGreaterThan(0);
        expect(body.content[0].state).toBe("DRAFT");
        expect(body.content[0].slug).toBe(testPost.slug);
        expect(body.content[0].title).toBe(testPost.title);
        expect(body.content[0].tags).toBe(testPost.tags);
        expect(body.content[0].description).toBe(testPost.description);
        expect(body.content[0].thumbnail).toBe(testPost.thumbnail);
        expect(body.content[0].viewCount).toBe(1);
        expect(body.content[0].updatedAt).toBe(testPost.updatedAt.toISOString());
        expect(body.currentPage).toBe(1);
        expect(body.totalPage).toBeGreaterThan(0);
        expect(body.totalCount).toBeGreaterThan(0);

        await deletePostContent(testPostContent.id);
        await deletePost(testPost.id);
        await deleteSpace(testSpace.id);
    });

    it("Should success to request post", async () => {
        const testSpace = await createSpace(
            "test_uid",
            "test_space_slug",
            "test_space_title",
        )
        const testPost = await createPost(
            testSpace.id.toString(),
            "test_slug",
            "test_title",
            "test_tags",
            "test_description",
            "test_thumbnail",
        );

        const testPostContent = await createPostConetent(
            testPost.id.toString(),
            "test_contentId",
            "{}"
        )

        const response = await SELF.fetch(
            `https://example.com/post/${testPost.id}`,
        );
        const body = await resolveBodyToJson<PostDetail>(response);

        expect(response.status).toBe(200);
        expect(body.id).toBe(testPost.id);
        expect(body.content).toBeDefined();
        expect(body.content.id).toBe(testPostContent.id);
        expect(body.content.postId).toBe(testPost.id);
        expect(body.content.json).toEqual("{}");
        expect(body.state).toBe("DRAFT");
        expect(body.slug).toBe(testPost.slug);
        expect(body.title).toBe(testPost.title);
        expect(body.tags).toBe(testPost.tags);
        expect(body.description).toBe(testPost.description);
        expect(body.thumbnail).toBe(testPost.thumbnail);
        expect(body.viewCount).toBe(1);
        expect(body.updatedAt).toBe(testPost.updatedAt.toISOString());
        expect(body.createdAt).toBe(testPost.createdAt.toISOString());

        await deletePostContent(testPostContent.id);
        await deletePost(testPost.id);
        await deleteSpace(testSpace.id);
    });
});

async function createSpace(
    uid: string,
    slug: string,
    title: string,
): Promise<typeof space.$inferSelect> {
    const db = drizzle(env.DB);

    const [result] = await db
        .insert(space)
        .values({
            id: crypto.randomUUID(),
            uid,
            slug,
            metaDatabaseId: crypto.randomUUID(),
            postDatabaseId: crypto.randomUUID(),
            title,
            state: SpaceState.ACTIVATED,
            lastRefreshedAt: new Date(),
        })
        .returning();

    return result;
}

async function createPost(
    spaceId: string,
    slug: string,
    title: string,
    tags: string,
    description: string,
    thumbnail: string,
): Promise<typeof post.$inferSelect> {
    const db = drizzle(env.DB);

    const [result] = await db
        .insert(post)
        .values({
            id: crypto.randomUUID(),
            spaceId,
            state: PostState.PUBLISHED,
            slug,
            title,
            tags,
            description,
            thumbnail,
        })
        .returning();

    return result;
}

async function createPostConetent(
    postId: string,
    id: string,
    json: string
): Promise<typeof postContent.$inferSelect> {
    const db = drizzle(env.DB)

    const [result] = await db
        .insert(postContent)
        .values({
            postId,
            id,
            json,
        })
        .returning();

    return result;
}

async function deletePost(id: string): Promise<void> {
    const db = drizzle(env.DB);
    await db.delete(post).where(eq(post.id, id));
}

async function deleteSpace(id: string): Promise<void> {
    const db = drizzle(env.DB);
    await db.delete(space).where(eq(space.id, id));
}

async function deletePostContent(id: string): Promise<void> {
    const db = drizzle(env.DB);
    await db.delete(postContent).where(eq(postContent.id, id));
}