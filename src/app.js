const express = require("express");
const bcrypt = require("bcrypt");
const { Schema } = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

const connectDB = require("./config/database");
const User = require("./models/user");
const userAuth = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {
  const emailID = req.body.email;
  const user = await User.find({ emailID: emailID });
  res.send(user);
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailID, password } = req.body;

  const hashpassword = await bcrypt.hash(password, 10);
  //console.log(hashpassword);

  const user = new User({
    firstName,
    lastName,
    emailID,
    password: hashpassword,
  });
  try {
    await user.save();
    res.send("User registered");
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID: emailID });
    console.log(user);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {

      const token = await jwt.sign({_id : user._id}, "DevTinder1*", {expiresIn : "7d"});
      res.cookie("token", token);
      res.send("Login Successful !!");
    } else {
      throw new Error("Invalid Credentials !!");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send("Something went Wrong");
  }
});

app.listen(3000, async () => {
  try {
    await connectDB;
    console.log("Connected to DataBase Successfully");
  } catch (err) {
    console.log("Error while connecting to DB");
  }
  console.log("Server running on port 3000");
});
