const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ApiResponse } = require("../utils/ApiResponse");
require("dotenv").config()

const secretKey='your-secret-key'

 const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(500, "Something went wrong while generating refresh and access tokens");
  }
};


const getUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//endpoint to access all the users except the who's is currently logged in!
const getUserId =asyncHandler(async(req,res)=>{
try {
    const loggedInUserId=req.params.userId; //users/123
  const user =await  User.find({_id: {$ne:loggedInUserId}}) 
  res.status(200).json(user)
}catch (error) {
  res.status(500).json({message:"Error retrieving users",error})
}
  
  })



const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill required fields" });
  }

  try {
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.json({ message: "User or email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      username: username.toLowerCase(),
    });

    const accessToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  
    const options={
      httpOnly:true,
      secure:true,
    }
     
    //later i see two of these 
  //  res.cookie('accessToken',accessToken,options)
  //  res.cookie('refreshToken',refreshToken)

    user.refreshToken = refreshToken;
    await user.save();

    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    if (!createdUser) {
      return res.status(404).json({ message: "Something went wrong while registering" });
    }

    return res.status(201).json(
      new ApiResponse(200, { createdUser, accessToken, refreshToken }, "User registered successfully")
    );
  } catch (error) {
   
    return res.status(500).json({ message: "Error registering user" });
  }
});

const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please fill both fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const accessToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '24h' });
    const refreshToken = user.generateRefreshToken(); // Assuming this method generates a refresh token

    await user.save(); // Save the updated user document with the refresh token

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); // Fix here: user._id instead of user_.id
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, {
          user: loggedInUser,
          accessToken,
          refreshToken,
        }, "User logged in successfully")
      );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong while login" });
  }
});


const logOutUser=asyncHandler(async(req,res)=>{
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {$unset:{refreshToken:" "}},
      {new:true}
    );

   const options={
    httpOnly:true,
    secure:true,
    expires: new Date(0), // Expire the cookies immediately
    sameSite: 'strict' // Set your preferred sameSite option
   }

   res.clearCookie("accessToken",options);
   res.clearCookie("refreshToken",options);
   return res.status(200).json(new ApiResponse(200, {}, "User logged out"));

  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, "Error logging out"));
  }
})
const refreshAccessToken=asyncHandler(async(req,res)=>{
const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;

if (!incomingRefreshToken) {
  return res.status(401).json({ message: "Unauthorized request" });
}

try {
  const decodeToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
console.log(decodeToken)
    /**
     * Gets the user by ID from the decoded JWT token.
     * This allows us to find the user associated with the refresh token.
     */
    const user = await User.findById(decodeToken?.userId)

if (!user) {
  return res.status(404).json({ message: "User not found" });
}

if (incomingRefreshToken !== user?.refreshToken) {
  return res.status(404).json({ message: "Expired token" });
}

const options={
  httpOnly:true,
  secure:true,
}
const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json(
    new ApiResponse(
      200,
      { accessToken, refreshToken: newRefreshToken },
      "Access token refreshed"
    )
  );

} catch (error) {
  console.log(error)
 res.status(500).json({message:"Something went wrong"})
}

})

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req?.user?.id; // Assuming userId is obtained from authentication
  
  try {
    // Finding user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided old password matches the user's current password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Check if the new password matches the old password
    const newPasswordMatch = await bcrypt.compare(newPassword, user.password);

    if (newPasswordMatch) {
      return res.status(400).json({ message: "New password should be different from the old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating password" });
  }
});







module.exports = { getUser,createUser,logInUser,logOutUser,refreshAccessToken,changePassword,getUserId};
