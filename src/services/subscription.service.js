import { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscriptions.model.js";
import { ApiError } from "../utils/ApiEror.js";

const toggleSubscribtion=async (req,res) => {
    const {channelId}  = req.params;
    const  subscriberId =  req?.user._id 

    if (!channelId) {
            throw new ApiError(406,"Un registerred channel")
    }

    if (!subscriberId) {
            throw new ApiError(406,"Unaughorized request")
    }

    
    if (subscriberId.equals(channelId)) {
            throw new ApiError(406,"Unaughorized request: user can not subscribe yourself")
    }
    
    const  isSubscriber  =await Subscription.findOne({channel:channelId , subscriber: subscriberId})
    if (isSubscriber) {
          await Subscription.deleteOne({channel:channelId , subscriber: subscriberId})
          return {
        subscribed: false,
        message: "Unsubscribed successfully"
    };
    }
     
    await Subscription.create({channel:channelId, subscriber : subscriberId})
    return {
        subscribed: true,
        message: "Subscribed successfully"
    }

    
    
}

const  getUserChannelSubscribers  =   async (req,res) => {
    const {channelId} = req.params ;
    if (!isValidObjectId(channelId)) {
        throw new ApiError(406,"Invalid channel id")
    }

    const subscriber = await Subscription.find({channel:channelId}).populate({path:"subscriber", select: "-refreshToken -password"})
    if (!subscriber) {
        throw new ApiError(406,"subscriber does not  exits")
    }

    
     
}

const  getSubscribedChannels  =   async (req,res) => {
    const {subscriberId} = req.params;
    if (!isValidObjectId(channelId)) {
        throw new ApiError(406,"Invalid channel id")
    }

    const subscribedChannels = await Subscription.find({subscriber:subscriberId}).populate({path:"subscriber", select: "-refreshToken -password"})
    if (!subscribedChannels) {
        throw new ApiError(406,"channels does not  exits")
    }

   return subscribedChannels    
     
}
export default {toggleSubscribtion,getUserChannelSubscribers,getSubscribedChannels}