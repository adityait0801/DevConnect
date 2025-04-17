const express = require('express');

const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills"

userRouter.get("/user/requests/received", async(req, res)=> {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
      req.statusCode(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", async (req, res)=> {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser, status : "accepted"},
                {fromUserId : loggedInUser, status : "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map(row => {
            if(row.fromUserId._id === row.toUserId._id) {
                return row.toUserId;     
            }
            return row.fromUserId;
        })

        res.json({data});

    } catch (err) {
        req.statusCode(400).send("ERROR: " + err.message);
    }
});


module.exports = userRouter;
