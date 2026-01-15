import subscriptionService from "../services/subscription.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";


const toggleSubscribtion =AsyncHandler(
    async (req,res) => {
        const data=await  subscriptionService.toggleSubscribtion(req,res)
        return  res.status(202).json(
            new ApiResponse(202,data,"User subscription succesfully")
        )     
    }
)



const getUserChannelSubscribers =AsyncHandler(
    async (req,res) => {
        const data=await  subscriptionService.getUserChannelSubscribers(req,res)
        return  res.status(202).json(
            new ApiResponse(202,data,"User subcriber recieved")
        )     
    }
)


const getSubscribedChannels =AsyncHandler(
    async (req,res) => {
        const data=await  subscriptionService.getSubscribedChannels(req,res)
        return  res.status(202).json(
            new ApiResponse(202,data,"Subscribed Channel recieved")
        )     
    }
)



export default {toggleSubscribtion,getUserChannelSubscribers,getSubscribedChannels}