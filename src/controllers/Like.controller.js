import { Like } from "../models/Like.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Video } from "../models/Video.model.js";
import { Comment } from "../models/Comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "VideoId not found");
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the user has already liked the video
  const existingLike = await Like.findOne({
    video: video._id,
    likeBy: user._id,
  });

  if (existingLike) {
    // User has already liked the video, so remove the like
    const LikeCount = await Like.findByIdAndDelete(existingLike._id).count();

    return res
      .status(200)
      .json(new apiResponse(200, LikeCount, "Like removed successfully"));
  } else {
    // User has not liked the video, so add a new like
    const LikeCount = await Like.create({
      video: video._id,
      likeBy: user._id,
    }).count();

    return res
      .status(200)
      .json(new apiResponse(200, LikeCount, "Like added successfully"));
  }
});

const Countlike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // console.log(videoId);
  if (!videoId) {
    throw new ApiError(401, "videoId not Found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const countLike = await Like.find({
    video: video._id,
  }).count();
  // console.log("Like Count is:", countLike);

  return res
    .status(200)
    .json(new apiResponse(200, countLike, "Likes fetched Successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment
  const { commentId } = req.params;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the comment exists
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if the user has already liked the comment
  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: user._id,
  });

  if (existingLike) {
    // User has already liked the comment, so remove the like
    await Like.findByIdAndDelete(existingLike._id);

    return res
      .status(200)
      .json(new apiResponse(200, {}, "Like removed successfully"));
  } else {
    // User has not liked the comment, so add a new like
    const newLike = await Like.create({
      comment: commentId,
      likedBy: user._id,
    });

    return res
      .status(200)
      .json(new apiResponse(200, newLike, "Like added successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  Countlike,
};
