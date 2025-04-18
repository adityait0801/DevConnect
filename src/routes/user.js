const express = require('express');

const ConnectionRequest = require("../models/connectionRequest");
const userAuth  = require("../middlewares/auth");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills"

userRouter.get("/user/requests/received", userAuth, async(req, res)=> {
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

userRouter.get("/user/connections", userAuth, async (req, res)=> {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser, status : "accepted"},
                {fromUserId : loggedInUser, status : "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map(row => {
            if(row.fromUserId._id.toString() === row.toUserId._id.toString()) {
                return row.toUserId;     
            }
            return row.fromUserId;
        })

        res.json({data});

    } catch (err) {
        req.statusCode(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed?page=1&limit=2", userAuth, async(req, res)=> {
   try{
        const loggedInUser = req.user;
        
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, toUserId: loggedInUser._id}
            ],
        }).select("fromUserId  toUserId");;

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req)=> {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id : { $nin : Array.from(hideUserFromFeed) }},
                { _id : { $ne : loggedInUser._id }}
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.json({ data: users });
    } 
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;
