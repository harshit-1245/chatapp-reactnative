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

const sendMessage=asyncHandler(async(req,res)=>{
try {
    const {senderId,recepientId,messageType,messageText}=req.body;
   const newMessage=new Message({
    senderId,
    recepientId,
    messageType,
    messageText,
    timestamp:new Date(),
    imageUrl:messageType === "image",
   })
   res.status(200).json({message:"message sent successfully"})


} catch (error) {
    res.status(500).json({message:"Error while sending message"})
}
})

const getChat=asyncHandler(async(req,res)=>{
  try {
    const {senderId,recepientId}=req.params;
    
    const messages = await Message.findOne({
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

