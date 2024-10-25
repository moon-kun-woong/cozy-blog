import { metaController } from "./meta";
import { postController } from "./post";
import { postLikeController } from "./post-like";
import { refreshRequestController } from "./refresh-request";
import { spaceController } from "./space";
import { memberConnectionController } from "./member-connection";

const contorllers = [
  spaceController,
  refreshRequestController,
  postController,
  postLikeController,
  metaController,
  memberConnectionController
];

export default contorllers;