const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
require("dotenv").config();

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        match: /^[a-zA-Z0-9_]+$/, // showld have number and alaphabetic characters
    },
    email:{
        type:String,
        required:true,
        match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, //simple email format
    },
    password:{
        type:String,
        required:true,
        // match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, // Regular expression for a password with minimum 8 characters, at least one letter, one number, and one special character
    },
    image:{
     type:String,
    
    },
    refreshToken:{
        type:String,
    },
    friendRequest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    friend:[
        {
            type:mongoose.Schema.Types.ObjectId,
            Ref:"User"
        }
    ],
    sendFriendRequest:[
        {
            //The sendFriendRequest field is an array that contains references to other documents in the "user" collection. It uses mongoose.Schema.Types.ObjectId to represent these references as unique identifiers (ObjectId) pointing to documents in the "user" collection. 
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
})





// Inside your User model schema definition
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id }, // Payload with user ID or any other necessary information
    process.env.REFRESH_TOKEN_SECRET, // Replace with your refresh token secret
    { expiresIn: '7d' } // Set the expiration for the refresh token as needed
  );

  this.refreshToken = refreshToken; // Update the refreshToken field in the schema
  return refreshToken; // Return the generated refresh token
};

const User=mongoose.model("User",userSchema);

module.exports=User;