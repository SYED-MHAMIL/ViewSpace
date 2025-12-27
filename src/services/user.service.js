import { ApiError } from "../utils/ApiEror.js"

// add

const  registerUser = (req,res)=>{ 
       const {username,email,fullname,password} =req?.body
       const isAll =  [username,email,fullname,password].some((field)=> field?.trim == "") 


        if(isAll){
            throw new ApiError("404","All field is  required")
        }
}

export  default {registerUser}