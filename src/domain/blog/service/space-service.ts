import { eq, sql } from "drizzle-orm";
import { space } from "../entity";
import { v4 as uuidv4 } from 'uuid';
import { SpaceState } from "../models/space";
import { DrizzleD1Database } from "drizzle-orm/d1";


export class SpaceService {

    async findAllSpace(db: DrizzleD1Database, page: any, size: any) {

        const currnetPage = parseInt(page ?? '0')
        const sizeNumber = parseInt(size ?? '20')

        const offset = currnetPage * sizeNumber

        const content = await db
            .select({
                id: space.id,
                uid: space.uid,
                title: space.title,
                state: space.state,
                slug: space.slug
            })
            .from(space)
            .limit(sizeNumber)
            .offset(offset)
            .all()

        return {
            content: content,
            currentPage: currnetPage,
            totalPage: Math.ceil(currnetPage / sizeNumber),
            totalCount: currnetPage
        };
    }

    async findOneSpaceBySlug(db: DrizzleD1Database, slug: any) {

        const [result] = await db
            .select()
            .from(space)
            .where(eq(space.slug, slug))

        return result
    }

    async createSpace(db: DrizzleD1Database, slug: any, body: any) {
        const { uid, title, metaDatabaseId, postDatabaseId } = body
        const createdId = uuidv4()

        const [result] = await db
            .insert(space)
            .values({
                id: createdId,
                uid,
                slug,
                metaDatabaseId,
                postDatabaseId,
                title,
                state: SpaceState.ACTIVATED,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastRefreshedAt: new Date(),
            }).returning()

        return result;
    }

    async updateSpaceBySlug(db: DrizzleD1Database, slug: any, body: any) {
        const { metaDatabaseId, postDatabaseId, title, state } = body
        const [result] = await db
            .update(space)
            .set({
                title,
                state,
                metaDatabaseId,
                postDatabaseId,
            })
            .where(eq(space.slug, slug)).returning()
        return result
    }

    async deleteSpace(db: DrizzleD1Database, slug: any) {
        const result = await db
            .delete(space)
            .where(eq(space.slug, slug))

        return result

    }

    async checkAvailability(slug: any, title: any) {

        slug = slug
        title = title

        console.log(slug, title)

        function checkSlug(slug: any): Boolean {
            let regex = new RegExp("\w+").exec("^[a-zA-Z0-9가-힣\-_]+$")
            if (regex?.find(slug) == null) return false
            else return true
        }

        function checkName(title: String): Boolean {
            if (title == null) return false
            else return true
        }

        if (slug != null && !checkSlug(slug)) return false
        if (title != null && !checkName(title)) return false

        return true
    }

    async updateSpaceById(db: DrizzleD1Database, id: any, body: any) {

        const { metaDatabaseId, postDatabaseId, title, state } = body
        const [result] = await db
            .update(space)
            .set({
                title,
                state,
                metaDatabaseId,
                postDatabaseId,
            })
            .where(sql`id=${id}`).returning()

        return result
    }

}