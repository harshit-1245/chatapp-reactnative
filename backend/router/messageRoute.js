const express=require("express");
const { getMessages,sendMessage,getChat } = require( "../controllers/messageControllers" );
const router =express.Router()


router.route("/").get(getMessages);
router.route("/send").post(sendMessage)
router.route("/:senderId/:recepientId").get(getChat)


module.exports=router



