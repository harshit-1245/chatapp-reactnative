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
        res.status(500).json({message:"Something went wrong while getting star message"})
    }
})

const deleteStarMessage=asyncHandler(async(req,res)=>{


 try {
    const { messageIds } = req.body;
    

    // Assuming your Star model has an _id property
    const filter = { _id: { $in: messageIds } };

    // Use deleteMany to delete multiple documents based on the provided IDs
    const result = await Star.deleteMany(filter);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Star messages deleted successfully" });
    } else {
      res.status(404).json({ message: "No matching star messages found for deletion" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong while deleting star messages" });
  }
})

module.exports= {starMessage,deleteStarMessage}