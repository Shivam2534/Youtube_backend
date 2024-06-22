import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/User.model.js";
import { Subscribtion } from "../models/Subscribtion.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params;
  console.log(channelId);
  if (!channelId) {
    throw new ApiError(404, "channeld is not found");
  }

  let user = await User.findById(req.user?._id);
  // console.log(user);
  if (!user) {
    throw new ApiError(400, " user not found");
  }

  const IsSubscription = await Subscribtion.findOne({
    subscriber: user?._id,
    channel: channelId,
  });

  if (IsSubscription) {
    // Unsubscribe
    console.log("Unsubscribe");    
    await Subscribtion.findByIdAndDelete(IsSubscription._id);

    return res.status(200).json(new apiResponse(200, false, "Subscribe"));
  } else {
    // subscribe
    console.log("subscribe");
    const subscribe = await Subscribtion.create({
      subscriber: user?._id,
      channel: channelId,
    });

    return res.status(200).json(new apiResponse(200, true, "Subscribed"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Cannot fetch channel id from params");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel does not exist");
  }

  //get the subscribers
  const subscribers = await Subscribtion.find({
    channel: channel?._id,
  }).populate("subscriber");

  //get the subscriber count
  const subscriberCount = await Subscribtion.countDocuments({
    channel: channelId,
  });

  //returning the response
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { subscriberCount, subscribers },
        "Subscribers retrieved successfully"
      )
    );
});

const IsUserSubscribed = asyncHandler(async(req,res) =>{
   const {ChannelId} = req.params
   console.log("Got it-",ChannelId)

   const user = await User.findById(req.user?._id)
   if(!user){
    throw new ApiError(402,"No User found at a time of invoke of IsUserSubscribed")
   }

   console.log("UserId is - ",user?._id)

   const toggle = await Subscribtion.find({
    subscriber: user?._id,
    channel:ChannelId
   })

   let data = false;
   if(toggle.length > 0){
     data = true
   }
   console.log(toggle)
   return res
   .status(200)
   .json(new apiResponse(200, data,"We have find Successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const subscriptions = await Subscribtion.find({
    subscriber: subscriberId,
  }).populate("channel");

  const subscriptionsCount = await Subscribtion.countDocuments({
    subscriber: subscriberId,
  });

  //returning the response
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { subscriptionsCount, subscriptions },
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription,IsUserSubscribed, getUserChannelSubscribers, getSubscribedChannels };
