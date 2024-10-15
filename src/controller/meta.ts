import { t } from "elysia";
import { MetaImageCategory, metaModel, MetaTitle, query } from "../model/meta";
import { pageRequest, UUID } from "../model/global";
import { createBase } from "./util";
import { meta, metaImage, space } from "../entity";
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
          image: {
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
      images = result.map(it => it.image);

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
    ({ log, params: { id } }) => {
      log.debug(id);
      // todo: Implement find logic
      return {
        id: id,
        title: "HOME",
        content: {},
        updatedAt: new Date().toISOString(),
        images: [
          {
            category: "MAIN",
            url: "https://example.com/image.jpg",
            seq: 1,
          },
        ],
        space: {
          id: "00000000-0000-0000-0000-000000000000",
          slug: "dummy-space",
        },
      };
    },
    {
      params: t.Object({
        id: UUID,
      }),
      response: "meta.detail",
    },
  );
