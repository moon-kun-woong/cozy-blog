import { SELF, env } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import type { PageRequest, PageResponse as PR } from "../src/model/global";
import {
  simple,
  SpaceCreate,
  SpaceDetail,
  SpaceState,
  SpaceUpdate,
} from "../src/model/space";
import { resolveBodyToJson } from "./util";
import { space } from "../src/entity";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

describe("Space API test", () => {
  type PageResponse = PR<typeof simple>;

  it("Should success to request spaces", async () => {
    const testSpace = await createSpace(
      "test_uid",
      "test_space_slug",
      "test_space_title",
    );
    const response = await SELF.fetch("https://example.com/space");
    const body = await resolveBodyToJson<PageResponse>(response);

    expect(response.status).toBe(200);
    expect(body.content.length).toBeGreaterThan(0);
    expect(body.content[0].slug).toBe(testSpace.slug);
    expect(body.content[0].title).toBe(testSpace.title);
    expect(body.content[0].state).toBe("ACTIVATED");
    expect(body.currentPage).toBe(1);
    expect(body.totalPage).toBeGreaterThan(0);
    expect(body.totalCount).toBeGreaterThan(0);
  });

  it("Should success to request space", async () => {
    const testSpace = await createSpace(
      "test_uid",
      "test_space_slug",
      "test_space_title",
    );

    const response = await SELF.fetch(
      `https://example.com/space/${testSpace.slug}`,
    );
    const body = await resolveBodyToJson<SpaceDetail>(response);

    expect(response.status).toBe(200);
    expect(body.uid).toBe(testSpace.uid);
    expect(body.slug).toBe(testSpace.slug);
    expect(body.metaDatabaseId).toBe(testSpace.metaDatabaseId);
    expect(body.postDatabaseId).toBe(testSpace.postDatabaseId);
    expect(body.title).toBe(testSpace.title);
    expect(body.state).toBe("ACTIVATED");

    await deleteSpace(testSpace.id);
  });

  it("Should success to create space", async () => {
    const newSpace: SpaceCreate = {
      slug: "new_slug",
      metaDatabaseId: crypto.randomUUID(),
      postDatabaseId: crypto.randomUUID(),
      title: "new_title",
      uid: "new_uid",
    };

    const response = await SELF.fetch("https://example.com/space", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSpace),
    });

    const body = await resolveBodyToJson<SpaceDetail>(response);

    expect(response.status).toBe(200);
    expect(body.slug).toBe(newSpace.slug);
    expect(body.uid).toBe(newSpace.uid);
    expect(body.metaDatabaseId).toBe(newSpace.metaDatabaseId);
    expect(body.postDatabaseId).toBe(newSpace.postDatabaseId);
    expect(body.title).toBe(newSpace.title);
    expect(body.state).toBe("ACTIVATED");

    await deleteSpace(body.id);
  });

  it("Should fail to create space when given wrong request", async () => {
    const invalidSpace: Partial<SpaceCreate> = {
      slug: "a", // Too short
      metaDatabaseId: crypto.randomUUID(),
      postDatabaseId: crypto.randomUUID(),
      title: "a".repeat(41), // Too long
      uid: "test_uid",
    };

    const response = await SELF.fetch("https://example.com/space", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidSpace),
    });

    expect(response.status).toBe(400);
  });

  it("Should success to update space", async () => {
    const testSpace = await createSpace(
      "test_uid",
      "test_space_slug",
      "test_space_title",
    );

    const updateData: SpaceUpdate = {
      title: "updated_title",
      state: "ARCHIVED",
    };

    const response = await SELF.fetch(
      `https://example.com/space/${testSpace.slug}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      },
    );

    const body = await resolveBodyToJson<SpaceDetail>(response);

    expect(response.status).toBe(200);
    expect(body.title).toBe(updateData.title);
    expect(body.state).toBe(updateData.state);

    await deleteSpace(testSpace.id);
  });

  it("Should fail to update space when given wrong request", async () => {
    const testSpace = await createSpace(
      "test_uid",
      "test_space_slug",
      "test_space_title",
    );

    const invalidUpdate: SpaceUpdate = {
      title: "a", // Too short
    };

    const response = await SELF.fetch(
      `https://example.com/space/${testSpace.slug}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidUpdate),
      },
    );

    expect(response.status).toBe(400);

    await deleteSpace(testSpace.id);
  });

  it("Should success to delete space", async () => {
    const testSpace = await createSpace(
      "test_uid",
      "test_space_slug",
      "test_space_title",
    );

    const response = await SELF.fetch(
      `https://example.com/space/${testSpace.slug}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(200);

    // Verify the space is marked as deleted
    const db = drizzle(env.DB);
    const [deletedSpace] = await db
      .select()
      .from(space)
      .where(eq(space.id, testSpace.id));
    expect(deletedSpace.state).toBe(SpaceState.DELETED);

    await deleteSpace(testSpace.id);
  });

  it("Should return true when Space title is available", async () => {
    const response = await SELF.fetch(
      "https://example.com/space/availability?title=unique_title",
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toBe(true);
  });

  it("Should return false when Space name already exists", async () => {
    const testSpace = await createSpace(
      "test_uid",
      "test_space_slug",
      "test_space_title",
    );

    const response = await SELF.fetch(
      `https://example.com/space/availability?title=${testSpace.title}`,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toBe(false);

    await deleteSpace(testSpace.id);
  });

  it("Should return true when Space slug is available", async () => {
    const response = await SELF.fetch(
      "https://example.com/space/availability?slug=unique_slug",
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toBe(true);
  });

  it("Should return false when Space slug already exists", async () => {
    const testSpace = await createSpace(
      "test_uid",
      "test_space_slug",
      "test_space_title",
    );

    const response = await SELF.fetch(
      `https://example.com/space/availability?slug=${testSpace.slug}`,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toBe(false);

    await deleteSpace(testSpace.id);
  });

  it("Should return false when Space slug has invalid characters", async () => {
    const response = await SELF.fetch(
      "https://example.com/space/availability?slug=invalid:slug",
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toBe(false);
  });

  it("Should update space by ID", async () => {
    const testSpace = await createSpace(
      "test_uid",
      "test_space_slug",
      "test_space_title",
    );

    const updateData: SpaceUpdate = {
      title: "updated_by_id_title",
      state: "ARCHIVED",
      metaDatabaseId: crypto.randomUUID(),
      postDatabaseId: crypto.randomUUID(),
    };

    const response = await SELF.fetch(
      `https://example.com/space/${testSpace.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      },
    );

    const body = await resolveBodyToJson<SpaceDetail>(response);

    expect(response.status).toBe(200);
    expect(body.title).toBe(updateData.title);
    expect(body.state).toBe(updateData.state);
    expect(body.metaDatabaseId).toBe(updateData.metaDatabaseId);
    expect(body.postDatabaseId).toBe(updateData.postDatabaseId);

    await deleteSpace(testSpace.id);
  });

  it("Should handle pagination correctly", async () => {
    const testSpaces = await Promise.all([
      createSpace("test_uid_1", "space_slug_1", "space_title_1"),
      createSpace("test_uid_2", "space_slug_2", "space_title_2"),
      createSpace("test_uid_3", "space_slug_3", "space_title_3"),
    ]);

    const pageRequest: PageRequest = {
      page: 1,
      size: 2,
    };

    const response = await SELF.fetch(
      `https://example.com/space?page=${pageRequest.page}&size=${pageRequest.size}`,
    );
    const body = await resolveBodyToJson<PageResponse>(response);

    expect(response.status).toBe(200);
    expect(body.content.length).toBe(2);
    expect(body.currentPage).toBe(1);
    expect(body.totalPage).toBeGreaterThanOrEqual(2);
    expect(body.totalCount).toBeGreaterThanOrEqual(3);

    await Promise.all(testSpaces.map((s) => deleteSpace(s.id)));
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

async function deleteSpace(id: string): Promise<void> {
  const db = drizzle(env.DB);
  await db.delete(space).where(eq(space.id, id));
}
