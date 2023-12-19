const mongoose=require('mongoose')

const messageSchema=new mongoose.Schema({
    senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    },
    recepientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    messageType:{
       type:String,
       enum:["text","image"], //nothing accept ohet that these fields
    },
    message:{
    type:String,

    },
    imageUrl:{
    type:String,
    },
},{timestamps:true})


const Message=mongoose.model("Message",messageSchema)

module.exports=Message;