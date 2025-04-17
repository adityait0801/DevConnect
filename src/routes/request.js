const express = require("express");

const userAuth  = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

 const requestRouter = express.Router();
 
 requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
   const fromUserID = req.user._id;
   const toUserID = req.params.toUserId;
   const status = req.params.status;

   const allowedStatus = ["ignored", "interested"]

   if(!allowedStatus.includes(status)) {
    return res
    .status(400)
    .json({ message: "Invalid status type: " + status });
  }

   const toUser = await User.findById(toUserID);

   if(!toUser) {
    return res.status(404).json({ message: "User not found!" });
   }

   const existingConnectionRequest = await ConnectionRequest.findOne({
    $or : [
     { fromUserID, toUserID },
     { fromUserID : toUserID, toUserID : fromUserID },
    ],
   });

   if (existingConnectionRequest) {
    return res
      .status(400)
      .send({ message: "Connection Request Already Exists!!" });
    }

   const connectionRequest = new ConnectionRequest ({
    fromUserID,
    toUserID,
    status
   })

   const data = await connectionRequest.save();

   res.send({ message: req.user.firstName + " is " + status + " in " + toUser.firstName, data });
 });
 
module.exports = requestRouter;