const express = require("express");
const app = express();
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./config/db");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userRoute = require("./router/userRoute");
const cookieParser=require("cookie-parser")
const messageRouter = require("./router/messageRoute")
const starRouter =require("./router/starRouting")

require("dotenv").config();
const port = process.env.PORT || 7000; // Setting a default port

connectDB();
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(passport.initialize());

// Define your Passport local strategy here


app.use("/user", userRoute);
app.use("/message",messageRouter)
app.use("/star",starRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is live at ${port}`.yellow.bold);
});
