const express = require("express");
const { getMessages, sendMessage, getChat,deleteMessage } = require("../controllers/messageControllers");

const router = express.Router();



  
  // Define routes
  router.route("/").get(getMessages);
  router.route("/send").post(sendMessage);
  router.route("/:senderId/:recepientId").get(getChat);
  //endpoint for delete message
  router.route("/deletemessage").post(deleteMessage)

module.exports = router;
