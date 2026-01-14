import { Subscription } from "../models/subscriptions.model.js";
import { ApiError } from "../utils/ApiEror.js";

const toggleSubscribtion=async (req,res) => {
    const {channelId}  = req.params;
    const  subscriberId =  req?.user._id 

    if (channelId) {
            throw new ApiError(406,"UnRegisterred channel")
    }

    if (subscriberId) {
            throw new ApiError(406,"Unaughorized request")
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
        subscribed: false,
        message: "Unsubscribed successfully"
    }

    
    
}

const  getUserChannelSubscribers  =   async (req,res) => {
     const {channelId} = req.params
}

export default {toggleSubscribtion}