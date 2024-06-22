import mongoose from "mongoose";
import { Comment } from "../models/Comment.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Video } from "../models/Video.model.js";
import { CommentOnComment } from "../models/CommentsOnComment.model.js";

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { CommentString } = req.body;
  const { videoId } = req.params;
  // console.log(CommentString, videoId);
  if (!CommentString) {
    throw new ApiError(400, "Comment Content is a required field");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(
      400,
      "Please login first to Comment | Comment not Found"
    );
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(400, "Please login first to Comment");
  }

  const comment = await Comment.create({
    content: CommentString,
    owner: user?._id,
    video: video?._id,
  });

  // console.log(comment);
  if (!comment) {
    throw new ApiError(500, "Server Error, Comment not created");
  }

  return res
    .status(200)
    .json(new apiResponse(200, comment, "Comment created Successfully"));
});

const addCommentOnComment = asyncHandler(async (req, res) => {
  const { content, parentCommentId, videoId } = req.body; // uski comment id jispar comment kiya hai
  // console.log(content, parentCommentId);

  if (!content || !parentCommentId || !videoId) {
    throw new ApiError(400, "CommentOnComment Parammeters are required field");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(400, "Please login first to Comment | user not exit");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Please login first to Comment | video not exit");
  }
  const comment = await Comment.findById(parentCommentId);
  if (!comment) {
    throw new ApiError(400, "Please login first to Comment | No Comment Exist");
  }

  const commentData = await CommentOnComment.create({
    content,
    parentCommentId,
    owner: user._id,
    videoId: video._id,
  });

  // console.log(commentData);
  if (!commentData) {
    throw new ApiError(500, "Server Error, Comment not created");
  }

  return res
    .status(200)
    .json(new apiResponse(200, commentData, "Comment created Successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { updatedComment } = req.body;
  const { commentId } = req.params;
  console.log(updatedComment, commentId);
  if (!updatedComment) {
    throw new ApiError(400, "Comment Required");
  }

  const comment = await Comment.findById(commentId);
  console.log(comment);
  if (!comment) {
    throw new ApiError(401, "No comment found");
  }

  if (comment.owner.equals(req.user?._id.toString())) {
    console.log("true");
  } else console.log("false");

  if (comment.owner.equals(req.user?._id.toString())) {
    comment.content = updatedComment;
    await comment.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new apiResponse(200, comment, "Comment updated Successfully"));
  } else {
    throw new ApiError(403, "You can't updated this comment");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  console.log(commentId);
  if (!commentId) {
    throw new ApiError(400, "CommentId is a required field");
  }

  const comment = await Comment.findById(commentId);
  console.log(comment);
  if (!comment) {
    throw new ApiError(402, "Comment not found");
  }

  if (comment.owner.equals(req.user?._id.toString())) {
    await Comment.findByIdAndDelete(comment._id);
    console.log("Comment deleted successfully");

    return res
      .status(200)
      .json(new apiResponse(200, comment, "Comment deleted successfully"));
  } else {
    throw new ApiError(
      401,
      "You are not allowed to delete, only admin can do this"
    );
  }
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!videoId) {
    throw new ApiError(
      400,
      "videoId is a required field at a time of geting videosComments"
    );
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not Found");
  }

  const comments = await Comment.find({ video: video._id })
    .sort({ createdAt: -1 })
    .populate("owner");
  if (!comments) {
    throw new ApiError(402, "No comments Found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, comments, "All Comments Fetched Successfully"));
});

const getAllCommentComments = asyncHandler(async (req, res) => {
  const { parentCommentId, videoId } = req.query;
  // console.log("parentCommentId:", parentCommentId, "videoId:", videoId);
  const { page = 1, limit = 10 } = req.query;
  if (!videoId || !parentCommentId) {
    throw new ApiError(
      400,
      "videoId & parentCommentId is a required field at a time of geting getAllCommentsComment"
    );
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not Found");
  }
  const comment = await Comment.findById(parentCommentId);
  if (!comment) {
    throw new ApiError(404, "comment not Found");
  }

  const subComments = await CommentOnComment.find({
    videoId: video._id,
    parentCommentId: comment._id,
  }).sort({ createdAt: -1 }).populate("owner");

  if (!subComments) {
    throw new ApiError(402, "No comments Found");
  }

  // console.log(subComments);

  return res
    .status(200)
    .json(
      new apiResponse(200, subComments, "All SubComments Fetched Successfully")
    );
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  addCommentOnComment,
  getAllCommentComments,
};
