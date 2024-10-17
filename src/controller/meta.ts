import { t } from "elysia";
import { MetaImageCategory, metaModel, MetaTitle, query } from "../model/meta";
import { pageRequest, UUID } from "../model/global";
import { createBase } from "./util";
import { meta, metaContent, metaImage, space } from "../entity";
import { count, eq } from "drizzle-orm";

export const metaController = createBase("meta")
  .use(metaModel)
  .get(
    "",
    async ({ log, db, query }) => {
      log.debug(query);
      const currentPage = query.page ?? 1;
      const sizeNumber = query.size ?? 20;

      const offset = (currentPage - 1) * sizeNumber;

      const result = await db
        .select({
          id: meta.id,
          title: meta.title,
          updatedAt: meta.updatedAt,
          images: {
            metaId: metaImage.metaId,
            category: metaImage.category,
            url: metaImage.url,
            seq: metaImage.seq
          },
          space: {
            id: space.id,
            slug: space.slug,
          },
          spaceSlug: space.slug
        })
        .from(meta)
        .innerJoin(space, eq(meta.spaceId, space.id))
        .innerJoin(metaImage, eq(meta.id, metaImage.metaId))
        .offset(offset)
        .all();

      type MetaImage = {
        metaId: string,
        category: number,
        url: string,
        seq: number,
      }

      let images: Array<MetaImage>;
      images = result.map(it => it.images);

      const processImages = images.map(img => ({
        ...img,
        category: MetaImageCategory.anyOf.at(img.category)?.const || 'NONE'
      }))

      const processMeta = new Map<string, typeof result[0]>();
      result.forEach(data => {
        processMeta.set(data.id, data)
      })

      const metas = Array.from(processMeta.values());

      const content = metas.map(meta => ({
        ...meta,
        title: MetaTitle.meta.title,
        updatedAt: meta.updatedAt.toISOString(),
        images: processImages
          .filter(img => img.metaId === meta.id)
          .map(it => ({
            category: it.category,
            seq: it.seq,
            url: it.url,
          })),
      }));

      const [totalCount] = await db
        .select({ count: count() })
        .from(meta);

      return {
        content,
        currentPage: parseInt(`${currentPage}`),
        totalPage: Math.ceil(totalCount.count / sizeNumber),
        totalCount: totalCount.count
      };
    },
    {
      query: t.Composite([query, pageRequest]),
      response: "meta.simples",
    },
  )
  .get(
    "/:id",
    async ({ log, db, params: { id } }) => {
      log.debug(id);

      const [result] = await db
        .select({
          id: meta.id,
          title: meta.title,
          content: metaContent.json,
          updatedAt: meta.updatedAt,
          images: {},
          space: {
            id: space.id,
            slug: space.slug,
          },
        })
        .from(meta)
        .where(eq(meta.id, id))
        .innerJoin(space, eq(meta.spaceId, space.id))
        .innerJoin(metaContent, eq(metaContent.metaId, id))

      const images = await db
        .select({
          category: metaImage.category,
          url: metaImage.url,
          seq: metaImage.seq,
        })
        .from(metaImage)
        .where(eq(metaImage.metaId, meta.id))

      const processImages = images.map(img => ({
        ...img,
        category: MetaImageCategory.anyOf.at(img.category)?.const || 'NONE'
      }))

      const content = {
        ...result,
        title: MetaTitle.meta.title,
        content: Object(result.content),
        updatedAt: result.updatedAt.toISOString(),
        images: processImages
      }

      return content
    },
    {
      params: t.Object({
        id: UUID,
      }),
      response: "meta.detail",
    },
  );
