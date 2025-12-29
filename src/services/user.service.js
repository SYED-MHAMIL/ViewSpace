import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiEror.js"

// add

const  registerUser =async (req,res)=>{ 
       const {username,email,fullname,password} =req?.body
       console.log({username,email,fullname,password} );
       
       const isAllMissing =  [username,email,fullname,password].some((field)=>!field || field?.trim() === "") 
       const avatar = req.files.avatar[0]
       console.log("avatat",avatar);

        if(isAllMissing){
            throw new ApiError(404,"All field is  required")
        }

}

export  default {registerUser}