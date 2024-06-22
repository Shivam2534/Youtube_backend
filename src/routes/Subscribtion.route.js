import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
  toggleSubscription,
  IsUserSubscribed,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/Subscribtion.controller.js";

const router = Router();

router
  .route("/toggleSubscription/:channelId")
  .post(verifyJWT, toggleSubscription);
router
  .route("/IsUserSubscribed/:ChannelId")
  .get(verifyJWT,IsUserSubscribed);
router
  .route("/getUserChannelSubscribers/:channelId")
  .get(verifyJWT, getUserChannelSubscribers);
router
  .route("/getSubscribedChannels/:subscriberId")
  .get(verifyJWT, getSubscribedChannels);

export default router;
