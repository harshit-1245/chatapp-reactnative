const express = require("express");
const { getMessages, sendMessage, getChat } = require("../controllers/messageControllers");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define routes
router.route("/").get(getMessages);
router.route("/send").post(upload.single("imageFile"), sendMessage);
router.route("/:senderId/:recepientId").get(getChat);

module.exports = router;
