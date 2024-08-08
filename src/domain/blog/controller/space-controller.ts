import { App } from "../../../types";
import { spaceModel } from "../models/space";
import { SpaceService } from "../service/space-service";


export default function (app: App): any {
    return app
        .use(spaceModel)
        .decorate({spaceService : new SpaceService()})
        .get("/", async ({ db, query: {page, size}, spaceService }) => {

            const allSpace = await spaceService.findAllSpace(db, page, size)

            return allSpace

        }, { response: "pages", query: "pageQuery" })

        .get("/:slug", async ({ db, params: { slug }, spaceService }) => {

            const oneSpaceBySlug = await spaceService.findOneSpaceBySlug(db, slug)

            return oneSpaceBySlug

        }, { response: "detail" })

        .post("/:slug", async ({ db, params: { slug }, body, spaceService }) => {

            const createSpace = await spaceService.createSpace(db, slug, body)

            return createSpace

        }, { body: 'create', response: "detail" })

        .put("/:slug", async ({ db, params: { slug }, body, spaceService }) => {

            const updateBySlug = await spaceService.updateSpaceBySlug(db, slug, body)

            return updateBySlug

        }, { body: "update", response: "detail" })

        .delete("/:slug", async ({ db, params: { slug }, spaceService }) => {

            const deleteSpace = await spaceService.deleteSpace(db, slug)

            return deleteSpace
        })

        .get("/availability", async ({ query: { slug, title }, spaceService }) => {

            const checkAvailability = await spaceService.checkAvailability(slug, title)

            return checkAvailability
        }, { query: "availabilityQuery" })

        .patch("/:id", async ({ db, params: { id }, body, spaceService }) => {

            const updateById = await spaceService.updateSpaceById(db, id, body)

            return updateById
        }, { response: "detail", body: "update" })
}