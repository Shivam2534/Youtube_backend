import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComments,
  addCommentOnComment,
  getAllCommentComments,
} from "../controllers/Comment.controller.js";

const router = Router();

router.route("/addComment/:videoId").post(verifyJWT, addComment);
router.route("/addCommentToComment").post(verifyJWT, addCommentOnComment);
router.route("/updateComment/:commentId").patch(verifyJWT, updateComment);
router.route("/deleteComment/:commentId").delete(verifyJWT, deleteComment);
router.route("/getVideoComments/:videoId").get(getVideoComments);
router.route("/getAllCommentComments").get(getAllCommentComments);

export default router;
