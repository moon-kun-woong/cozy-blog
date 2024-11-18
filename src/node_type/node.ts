interface Node {
  origin: {
    properties: any,
    updatedAt: Date
  },
  id: string;
}

interface PostNode extends Node{
  properties: {
    state: String,
    slug: String,
    title: String,
    tags: String,
    description: String,
    createdAt: String,
    thumbnail: String
  }
}

interface MetaNode extends Node{
  properties: {
    title: String,
    images: any
  }
}