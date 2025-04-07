const express = require('express');

const connectDB = require('./config/database');
const User = require("./models/user");
const { Schema } = require('mongoose');

const app = express(); 

app.use(express.json());

app.get("/user", async(req, res)=> {
    const emailID = req.body.email;
    const user = await User.find({emailID : emailID});
    res.send(user);
});

app.post("/signup", async(req, res)=> {
    const user = new User (req.body);
    try {
        await user.save();
        res.send("User registered");
    }
    catch(error) {
        res.status(404).send(error);
    }
});

app.get("/feed", async(req, res)=> {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    }
    catch(error){
        res.status(404).send("Something went Wrong");
    }
})

app.delete("/user", async(req, res)=> {
    const userID = req.body.userID;
    // console.log(userID);

    try{
        const user = await User.findByIdAndDelete(userID);
        res.send("User Deleted");
    }
    catch(error){
        res.status(404).send("Something went Wrong");
    }
});

app.patch("/user", async(req, res)=> {
    const userID = req.body.userID;
    // console.log(userID);
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(userID, data);
        res.send("User Updated");
    }
    catch(error){
        res.status(404).send("Something went Wrong");
    }
});

app.listen(3000, async ()=> {
    try{
        await connectDB;
        console.log("Connected to DataBase Successfully");
    }
    catch(err)
    {
        console.log("Error while connecting to DB");
    }
    console.log("Server running on port 3000")
})

