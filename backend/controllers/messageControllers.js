const asyncHandler=require("express-async-handler")
const Message = require("../models/message")
const { ApiResponse } = require( "../utils/ApiResponse" )

const getMessages=asyncHandler(async(req,res)=>{
    try {
        const message=await Message.find()
        res.status(200).json(new ApiResponse(200,{},"Successfully get the data"))
    } catch (error) {
        res.status(500).json({message:"Error while getting"})
    }
})

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;
    
    let imageUrl = null;

    if (messageType === "image" && req.file) {
      // Use req.file.path as the imageUrl for images
      imageUrl = req.file.path;
    }

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      messageText,
      imageUrl,
    });

    await newMessage.save();

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while sending message" });
  }
});




  
  
const getChat=asyncHandler(async(req,res)=>{
  try {
    const {senderId,recepientId}=req.params;
    
    const messages = await Message.find({
        $or:[
            {senderId:senderId,recepientId:recepientId},
            {senderId:recepientId,recepientId:senderId},
        ],
    }).populate("senderId","_id username");

    res.status(200).json(messages)

    
  } catch (error) {
    res.status(500).json({message:"Error while getting chat"})

  }
})


module.exports={getMessages,sendMessage,getChat}

