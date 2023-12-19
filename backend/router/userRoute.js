const express=require("express");
const { getUser,createUser, logInUser } = require( "../controllers/userControllers" );
const router=express.Router()

router.route("/").get(getUser)
router.route("/register").post(createUser)
router.route("/login").post(logInUser)


module.exports=router;