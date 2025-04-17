const express = require("express");
const cookieParser = require('cookie-parser');

const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.listen(3000, async () => {
  try {
    await connectDB;
    console.log("Connected to DataBase Successfully");
  } catch (err) {
    console.log("Error while connecting to DB");
  }
  console.log("Server running on port 3000");
});
