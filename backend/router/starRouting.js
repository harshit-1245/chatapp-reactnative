const express = require("express");
const { starMessage } = require( "../controllers/starController" );
const router = express.Router();



//enpoint for getting Star message
router.route("/:recepientId").get(starMessage)

module.exports=router