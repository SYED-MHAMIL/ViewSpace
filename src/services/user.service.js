import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiEror.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { WatchEvent } from "../models/watchEvent.model.js";
import { WatchHistory } from "../models/watchHistory.model.js";

// user Authentication erelated
const generateAccessOrRefreshToken = async (id) => {
  const user = await User.findById(id);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  const { username, email, fullname, password } = req.body;

  const isAllMissing = [username, email, fullname, password].some(
    (field) => !field || field.trim() === ""
  );

  if (isAllMissing) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User email or username already exists");
  }

  const avatarPath = req?.files?.Avatar?.[0]?.path;
  const coverImagePath = req?.files?.CoverImage?.[0]?.path;

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

  const user = new User({
    fullname,
    email,
    password,
    username,
    avatar: uploadedAvatar.url,
    coverImage: uploadedCoverImage.url,
  });

  if (!user) {
    throw new ApiError(400, "User is not saved in DB");
  }
  console.log(user);

  await user.save();
  const user_plain = user.toObject();
  delete user_plain.password;

  console.log(user_plain);
  return user_plain;
};

const login = async (req, res) => {
  const { username, email, password } = req?.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or Email are required");
  }

  if (!password) {
    throw new ApiError(409, "Password are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  }).select("-refreshToken");

  if (!existedUser) {
    throw new ApiError(409, "User does not exists");
  }

  if (!(await existedUser?.isCorrectPassword(password))) {
    throw new ApiError(409, "password does not correct");
  }

  const { accessToken, refreshToken } = await generateAccessOrRefreshToken(
    existedUser._id
  );

  return { user: existedUser, accessToken, refreshToken };
};

const logOut = async (req, res) => {
  //  remove all tokens
  //  remove refresh in DB

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    { new: true }
  );
  console.log("logout RETURN ", user);
};

const refreshAccessToken = async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  if (!incomingToken) {
    throw new ApiError(404, "Unauthorized requests");
  }
  const decodedUser = jwt.verify(token, process.env?.REFRESH_TOKEN_KEY);
  if (!decodedUser) {
    throw new ApiError(404, "Invalid tokens");
  }

  const user = await User.findById(decodedUser._id);
  if (!user) {
    throw new ApiError(404, "Invalid user");
  }

  if (incomingToken !== user?.refreshToken) {
    throw new ApiError(404, "Reresh token is required OR used");
  }

  const { accessToken, refreshToken } =
    await generateAccessOrRefreshToken(user_id);
  await User.findOneAndUpdate(
    user._id,
    { $set: { refreshToken: refreshToken } },
    { new: True }
  );

  return { accessToken, refreshToken };
};

//  User  related services

const ChangeCurrentPassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword) {
    throw new ApiError(404, "Current password is required");
  }
  console.log();

  const decodedUser = await User.findById(req.user?._id);
  if (!decodedUser) {
    throw new ApiError(404, "Unauthorized  user");
  }

  const isCorrectPassword = decodedUser?.isCorrectPassword(currentPassword);
  if (!isCorrectPassword) {
    throw new ApiError(404, "password is not correct");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(404, "Password do not match");
  }

  decodedUser.password = confirmPassword;
  await decodedUser.save({ validateBeforeSave: false });
};

const getUser = async (req, res) => {
  const user = await User.findById(req.user?._id || req.params?.id);
  if (!user) {
    throw new ApiError(404, "Unauthorized  user");
  }
  return user;
};

const deleteUser = async (req, res) => {
  const user = await User.deleteOne({ _id: req.user?._id });
  if (!user) {
    throw new ApiError(404, "User does not exits");
  }

  return user;
};

const updateAcountsDetails = async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname) {
    throw new ApiError(406, "Full name is required for update the profiles");
  }

  if (!email) {
    throw new ApiError(406, "Email is required for update the profiles");
  }

  // TAKS FOR EMAIL VAIILDAITO tommorow
  const user = await User.findById(req.user._id);
  const isValidEmail = user.emailValidation(email);

  if (!isValidEmail) {
    throw new ApiError(406, "Email should be like 'example123@gmail.com'");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullname: fullname, email: email } },
    { new: true }
  );
  if (!updatedUser) {
    throw new ApiError(404, "User does not exits");
  }

  return updatedUser;
};

const getUserChannelProfile = async (req, res) => {
  const { username } = req.params;
  //  username means jsmastrry
  if (!username?.trim()) {
    throw new ApiError(406, "User is missing");
  }

  const channel = await User.aggregate([
    {
      $match: { username: username?.toLowerCase() },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribed",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribed",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        eamil: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  return channel;
};


const getUserWatchHistory = async (req, res) => {
  const userWatchHistory = await WatchHistory.aggregate([
    { $match: { userId: req.user._id } },
    // get event
    {
      $lookup:{
        from : "watchevents",
        localField : "_id",
        foreignField: "historyId",
        as : "event"
      }

    },
    {$unwind:"$event"},
    {
      $lookup:{
        from : "videos",
        localField : "videoId",
        foreignField: "_id" ,
        as: "video" ,
        pipeline : [
         {
          $lookup: {
            from : "users",
            localField : "owner",
            foreignField: "_id" ,
            as: "owner",
            pipeline :[
              {
                $project :{
                  fullname :1 ,
                  username :1,
                  avatar :1
                }
              }
            ]
          }

         },
         { $unwind:"$owner"},

        ]   
        
      }
    },
    {$unwind:"$video"}
    ,
    {
      $project :{
        watchedAt : "$event.watchedAt",

        video : {
          owner : "$video.owner",
          _id: "$owner._id",
           _id: "$video._id",
          title: "$video.title",
          thumbnail: "$video.thumbnail",
          video: "$video.videoFile",
          duration: "$video.duration",
        } 
 


      }
    },
    {
      $sort :{watchedAt:-1}
    }

     
   
  ]);

  return userWatchHistory;
};

export default {
  registerUser,
  login,
  logOut,
  refreshAccessToken,
  ChangeCurrentPassword,
  getUser,
  deleteUser,
  updateAcountsDetails,
  getUserChannelProfile,
  getUserWatchHistory,
};
                    