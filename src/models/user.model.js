import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema =new Schema({
           watchHistory: [{ type: Schema.Types.ObjectId, ref: 'Videos' }] ,
           username :{
               type: String,
               unique: true,
               required: true,
               lowercase : true,
               trim: true,
               index: true
           },
           email : {
               type: String,
               unique: true,
               required: true,
               lowercase : true,
               trim: true,
           },
           fullname:{
              type: String,
               unique: true,
               required: true,
               lowercase : true,
            
           },
           avatar : {
             type: String,
            //    unique: true,
               required: true,
           },
           coverImage : {
              type: String,
        //    unique: true,
              required: true,
           },
           refreshToken : {
              type: String,
        //    unique: true,
            //   required: true,
           },
           password : {
                type : String,
                 required : [true,'Password is required']
           }

},{timestamps:true})





userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)

})


userSchema.methods.isCorrectPassword= async function (password) {
       return  await bcrypt.compare(password,this.password)      
}




userSchema.methods.generateAccessToken = async function ()  {
   return  await jwt.sign({_id : this._id},process.env.ACCESS_TOKEN_KEY,  { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}



userSchema.methods.generateRefreshToken = async function ()  {
    return  await jwt.sign({_id : this._id},process.env.REFRESH_TOKEN_KEY,  { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}





export  const  User =  mongoose.model("User",userSchema)
