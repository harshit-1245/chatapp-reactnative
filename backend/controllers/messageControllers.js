const asyncHandler=require("express-async-handler")
const Message = require("../models/message")
const { ApiResponse } = require( "../utils/ApiResponse" )
const Star = require( "../models/starMessage" )
const User = require( "../models/User" )


const getMessages=asyncHandler(async(req,res)=>{
    try {
        const message=await Message.find()
        res.status(200).json(message)
    } catch (error) {
      
        res.status(500).json({message:"Error while getting",error})
    }
})


const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;
    
    let imageUrl = null;

    if (messageType === "image" && req.body) {
      // Use req.file.filename to get the image filename
      imageUrl = req.body.image;
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
    console.log(error)
    res.status(500).json({message:"Error while getting chat"})

  }
})

const deleteMessage=asyncHandler(async(req,res)=>{
  try {
    const {message}= req.body;
   
    if(!Array.isArray(message) || message.length === 0){
      res.status(400).json({message:"not anything in body"})
    }

    await Message.deleteMany({_id: {$in: message}});
    res.status(200).json({message:"Message deleted successfully"})
  } catch (error) {
    res.status(500).json({message:"Something went wrong while deleting"})
  }
})

const starredMessage=asyncHandler(async(req,res)=>{
  try {
    const {message,userId,recepientId}=req.body;
     // Assuming your request body structure has a field named `messageText`
     const starredMessages = await Promise.all(
      message.map(async (messageId) => {
        // Fetch message details from the database using messageId
        const messageDetails = await Message.findById(messageId);
        return messageDetails?.messageText || null;
      })
    );
    
    const newStar = new Star({
    messageId:message,
    senderId : userId,
    recepientId,
    messageText:starredMessages,
  })

  await newStar.save()
  res.status(200).json({messages:"Stared message stored successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Somthing went wrong while starred"})
  }
})



module.exports={getMessages,sendMessage,getChat,deleteMessage,starredMessage}

