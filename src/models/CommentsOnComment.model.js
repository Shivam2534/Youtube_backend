import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentsOnCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

CommentsOnCommentSchema.plugin(mongooseAggregatePaginate)

export const CommentOnComment = mongoose.model("CommentOnComment", CommentsOnCommentSchema);
