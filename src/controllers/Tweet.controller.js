import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/Tweet.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  console.log(content);
  if (!content) {
    throw new ApiError(401, "Content is a Required field");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });
  console.log(tweet);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const tweets = await Tweet.find({ owner: req.user?._id });
  console.log(tweets);
  if (!tweets) {
    throw new ApiError(404, "No Tweets found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, tweets, "Tweets Fetched Successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;
  console.log(tweetId, content);
  if (!(tweetId && content)) {
    throw new ApiError(401, "TweetId & content are required fields");
  }

  const tweet = await Tweet.findById(tweetId);
  console.log(tweet);
  if (!tweet) {
    throw new ApiError(402, "NO Tweet found");
  }

  if (tweet.owner.equals(req.user?._id.toString())) {
    tweet.content = content;
    await tweet.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new apiResponse(200, tweet, "tweet updated successfully"));
  } else {
    throw new ApiError(
      401,
      "You are not Allowed to updated, only owner can do this"
    );
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(404, "tweetId not found");
  }

  const tweet = await Tweet.findById(tweetId);
  if(!tweet){
    throw new ApiError(402,"Tweet not found")
  }

  if (tweet.owner.equals(req.user?._id.toString())) {
    await Tweet.findByIdAndDelete(tweetId)
    return res
      .status(200)
      .json(new apiResponse(200, tweet, "tweet Deleted successfully"));
  } else {
    throw new ApiError(
      401,
      "You are not Allowed to Delete, only owner can do this"
    );
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
