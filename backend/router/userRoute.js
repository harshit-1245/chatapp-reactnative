const express=require("express");
const { getUser,createUser,logInUser,logOutUser,refreshAccessToken, changePassword,getUserId} = require( "../controllers/userControllers" );
const verifyJwt = require( "../middlewares/authentication" );
const router=express.Router()

router.route("/").get(getUser)
router.route("/:userId").get(getUserId)
router.route("/register").post(createUser)
router.route("/login").post(logInUser)
router.route("/logout").post(verifyJwt,logOutUser)
//endpoint for refresh token
router.route("/refresh").post(refreshAccessToken)
router.route("/changepassword").post(verifyJwt,changePassword)



module.exports=router;