import { error } from "elysia"
import { cacheImage } from "./client"

export async function scanAndCache(node: JSON): Promise<JSON> {

    if (!("object" in node) || node["object"] !== "page") {
        throw error("Expectation Failed", `[${node}] Cache target should be page`)
    }

    const page = Object(node)["page"]

    if ("MainImages" in page.properties) {
        const mainImagesFiles = page.object.properties["MainImages"].files
        resolveCache(mainImagesFiles)
    }

    if (Object(node)["cover"] !== null && Object(node)["cover"] !== undefined) {
        const cover = Object(node)["cover"]
        resolveCache(cover)
    }

    return await scanAndCacheBlock(node)
}

export async function scanAndCacheBlock(node: JSON): Promise<JSON> {

    if ("blocks" in node) {
        Object(node)["blocks"].map((block: any) => scanAndCacheBlock(block));
    }

    if (!("type" in node)) return node

    const block = Object(node)["blocks"].block
    if (block.type !== "image") return node

    const image = block.image
    await resolveCache(image)

    return node;
}

export async function resolveCache(image: Object) {
    const url = Object(image)["url"]
    const accountId = process.env.CLOUD_FLARE_IMAGES_ACCOUNT_ID?.toString() || "Not Found"
    const token = process.env.CLOUD_FLARE_IMAGES_TOKEN?.toString() || "Not Found";

    console.trace(`Find filetype image(id = ${url}) try to cache.`)
    const res = await cacheImage(`Bearer ${token}`, accountId, url)

    const cachedUrl = Object(res)["/result/variants/0"]
    const urlParts = cachedUrl.split("/")
    urlParts.pop()
    const removedVariantUrl = urlParts.join("/")

    const newField: Object = {
        "type": "EXTERNAL",
        "EXTERNAL": {
            "url": removedVariantUrl
        }
    }

    console.trace(`Success to cache image(id = ${url}) as ${JSON.stringify(newField)}`)
}