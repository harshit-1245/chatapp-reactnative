const mongoose=require("mongoose")

const starSchema=new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      recepientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }, 
    messageType: {
        type: String,
        enum: ["text", "image"],
        // required: true,
      },
      messageText: {
        type: [String], // Define messageText as an array of strings
        default: [],   // Set the default value to an empty array
      },
      imageUrl: {
        type: String,
        default: "",
        required: false, // Make imageUrl optional
      },
},{timestamps:true})

const Star = mongoose.model("Star",starSchema)
module.exports=Star;