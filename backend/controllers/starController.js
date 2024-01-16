const asyncHandler=require("express-async-handler");
const User = require( "../models/User" );
const Star = require( "../models/starMessage" );
// const Message = require( "../models/message" );

const starMessage=asyncHandler(async(req,res)=>{
    try {
        const {recepientId}=req.params;
        const recepient = await User.findById(recepientId)
        const username=recepient.username
        
        const starMessage=await Star.find({},'messageText').lean()
       
        
   res.status(200).json({message:"successfully got username and message",starMessage,username})
    } catch (error) {
        console.log(error)
    }
})

module.exports= {starMessage}