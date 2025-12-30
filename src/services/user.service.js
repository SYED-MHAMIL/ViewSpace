import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiEror.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// add

const  registerUser =async (req,res)=>{ 
       
    // check field ?
    // user is exit  ? 
    // 
const { username, email, fullname, password } = req.body;
console.log( {username, email, fullname, password });
console.log(req?.files);


const isAllMissing = [username, email, fullname, password]
  .some(field => !field || field.trim() === "");

if (isAllMissing) {
  throw new ApiError(400, "All fields are required");
}

const existedUser = await User.findOne({
  $or: [{ email },{ username }]
});

if (existedUser) {
  throw new ApiError(409, "User email or username already exists");
}

const avatarPath = req?.files?.Avatar?.[0]?.path;
const  coverImagePath  = req?.files?.CoverImage?.[0]?.path

if (!avatarPath) {
  throw new ApiError(400, "Avatar field is required");
}

const uploadedAvatar = await uploadOnCloudinary(avatarPath);
if (!uploadedAvatar) {
  throw new ApiError(500, "Avatar upload failed");
}

//  cover image

if (!coverImagePath) {
  throw new ApiError(400, "Avatar field is required");
}

const uploadedCoverImage = await uploadOnCloudinary(coverImagePath);
if (!uploadedCoverImage) {
  throw new ApiError(500, "Avatar upload failed");
}



 
 
 const user= new User({
   fullname,
   email,
   password,
   username,
   avatar:  uploadedAvatar.url,
    coverImage : uploadedCoverImage.url
 })

 if (!user) {
     throw new ApiError(400, "User is not saved in DB");
 }
 console.log(user);
 
 await user.save()  

return user
    
}

export  default {registerUser}