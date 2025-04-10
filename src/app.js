const express = require("express");
const bcrypt = require("bcrypt");
const { Schema } = require("mongoose");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

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

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successful !!");
    } else {
      throw new Error("Invalid Credentials !!");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send("Something went Wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userID = req.body.userID;
  // console.log(userID);

  try {
    const user = await User.findByIdAndDelete(userID);
    res.send("User Deleted");
  } catch (error) {
    res.status(404).send("Something went Wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userID = req.body.userID;
  // console.log(userID);
  const data = req.body;

  try {
    const Allowed_Updates = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Updates.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not Allowed !!");
    }

    const user = await User.findByIdAndUpdate(userID, data, {
      runValidators: true,
    });
    res.send("User Updated");
  } catch (error) {
    res.status(400).send("Update not Allowed !!");
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
