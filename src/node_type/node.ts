interface Node<T> {
  origin: {
    properties: T,
    updatedAt: Date
  },
  id: string;
}

interface PostProperties{
  state: String,
  slug: String,
  title: String,
  tags: String,
  description: String,
  createdAt: String,
  thumbnail: String
}

interface MetaProperties{
  title: String,
  images: any
}

type PostNode = Node<PostProperties>;
type MetaNode = Node<MetaProperties>;