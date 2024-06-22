import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  Countlike
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/toggleVideoLike/:videoId").post(verifyJWT,toggleVideoLike);
router.route("/Countlike/:videoId").post(verifyJWT,Countlike);
router.route("/toggleCommentLike/:commentId").post(verifyJWT,toggleCommentLike);

export default router;
