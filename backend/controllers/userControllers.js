const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ApiResponse } = require("../utils/ApiResponse");

const secretKey = 'your_secret_key';




const getUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, image } = req.body;

  if (!username || !email || !password || !image) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      email,
      image,
    });

    const accessToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "24h" });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      return res.status(500).json({ message: "Something went wrong while registering" });
    }

    return res.status(201).json(
      new ApiResponse(200, { user: createdUser, accessToken }, "User registered successfully")
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//function for creating token for user
const createToken = (userId) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

  return token;
};

const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Your logic to find the user by email or any other identifier
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate access token using the createToken function
    const accessToken = createToken(user._id);

    // Return the access token in the response
    return res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, email: user.email },
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = { getUser, createUser,logInUser };
