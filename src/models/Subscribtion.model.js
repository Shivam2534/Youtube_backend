import mongoose from "mongoose";

const SubscribtionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },
  { timestamps: true }
);

export const Subscribtion = mongoose.model("Subscribtion", SubscribtionSchema)
