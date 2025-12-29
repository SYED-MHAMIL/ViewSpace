import userService from "../services/user.service.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";


// regsiter  controller

const registerUser= AsyncHandler(async (req,res)=>{
     console.log(req.files);
     
     const  user  =await userService.registerUser(req,res)
      return  res.status(200).send(
        new ApiResponse(200,user,"User register successfullya")
     )
   
})


export default {registerUser}