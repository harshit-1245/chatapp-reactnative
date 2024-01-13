const express=require("express");
const { getUser,createUser,logInUser,logOutUser,refreshAccessToken, changePassword,getUserId,sendingRequest,friendScreen,acceptRequest,acceptedRequest, UserDetail} = require( "../controllers/userControllers" );
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
router.route("/friendRequest").post(sendingRequest)
router.route("/friendRequest/:userId").get(friendScreen)

//endpoint for accept a friend request of a perticular person
router.route("/friendRequest/accept").post(acceptRequest);
//endpoint for getting accepted request
router.route("/acceptedRequest/:userId").get(acceptedRequest)
//end point for getting userdetail for chat room
router.route("/getRecipient/:userId").get(UserDetail)
module.exports=router;