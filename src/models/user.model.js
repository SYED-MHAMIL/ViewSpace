import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema =new Schema({
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
              required: true,
           },
           password : {
                type : String,
                 required : true
           }

},{timestamps:true})

export  const  User =  mongoose.model("User",UserSchema)




UserSchema.pre("save",async () => {
    const hashPassword =  await  bcrypt.hash(this.password,10)
    this.password = hashPassword
})

UserSchema.methods.isCorrectPassword= async (password) => {
       return  await bcrypt.compare(this.password,password)      
}



UserSchema.methods.generateAccessToken = async () => {
    await jwt.sign(this._id,process.env.ACCESS_TOKEN_KEY,ACCESS_TOKEN_EXPIRY)
}



UserSchema.methods.generateRefreshToken = async () => {
    return  await jwt.sign(this._id,process.env.REFRESH_TOKEN_KEY,REFRESH_TOKEN_EXPIRY)
}





