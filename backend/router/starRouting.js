const express = require("express");
const { starMessage,deleteStarMessage } = require( "../controllers/starController" );
const router = express.Router();



//enpoint for getting Star message
router.route("/:recepientId").get(starMessage)

//endpoint for deleting message
router.route("/delete").post(deleteStarMessage)

module.exports=router