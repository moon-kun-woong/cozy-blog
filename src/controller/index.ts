import { metaController } from "./meta";
import { postController } from "./post";
import { postLikeController } from "./post-like";
import { refreshRequestController } from "./refresh-request";
import { spaceController } from "./space";

const contorllers = [
  spaceController,
  refreshRequestController,
  postController,
  postLikeController,
  metaController,
];

export default contorllers;
