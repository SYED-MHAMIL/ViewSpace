import userService from "../services/user.service.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// regsiter  controller

const registerUser= AsyncHandler(async (req,res)=>{     
     
     const  user  =await userService.registerUser(req,res)
      return  res.status(200).send(
        new ApiResponse(200,user,"User register successfullya")
     )
   
})

const login= AsyncHandler(async (req,res)=>{     
     

     const  {user,accessToken,refreshToken}  =await userService.login(req,res)
      
     const options= {
     // Cookie valid for 24 hours (1 day)
     httpOnly: true,  // Not accessible via JavaScript
     secure: true,    // Only sent over HTTPS
     
     }
     return  res
     .status(200)
     .cookie('accessToken', accessToken, options)
     .cookie('refreshToken', refreshToken, options)
     .json(
     
        new ApiResponse(200,{user,refreshToken},"User Loged in  successfullya")
     )
   
})


const logOut  = AsyncHandler(
     async (req,res) => {
     await  userService.logOut(req,res)       
  
       
     const options= {
     // Cookie valid for 24 hours (1 day)
     httpOnly: true,  // Not accessible via JavaScript
     secure: true,    // Only sent over HTTPS
     
     }
     res.status(403)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
      .json(
       new ApiResponse(200,null,"User logged Out successfully")
     )

  }

)



export default {registerUser,login,logOut}