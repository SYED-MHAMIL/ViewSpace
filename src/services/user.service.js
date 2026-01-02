import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiEror.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// function

const generateAccessOrRefreshToken = async (id) => {
  const user = await User.findById(id);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave:false });

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

//  login

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

  const { accessToken, refreshToken } =await generateAccessOrRefreshToken(
    existedUser._id
  );

  return { user: existedUser, accessToken, refreshToken };
};

const logOut = async (req, res) => {
  //  remove all tokens
  //  remove refresh in DB
  await User.findByIdAndUpdate(
    req._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
};

// const generateAccessOrRefreshToken =

export default { registerUser, login, logOut };
