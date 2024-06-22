import { Router } from "express";
import {verifyJWT} from '../middlewares/Auth.middleware.js'
import {createTweet, getUserTweets, updateTweet, deleteTweet} from "../controllers/Tweet.controller.js"

const router = Router()

router.route("/createTweet").post(verifyJWT,createTweet)
router.route("/getUserTweets").get(verifyJWT,getUserTweets)
router.route("/updateTweet/:tweetId").patch(verifyJWT,updateTweet)
router.route("/deleteTweet/:tweetId").delete(verifyJWT,deleteTweet)

export default router