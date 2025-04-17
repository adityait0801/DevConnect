const express = require('express');
const bcrypt = require("bcrypt");

const userAuth = require('../middlewares/auth');
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", userAuth, async (req, res)=> {
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

authRouter.post("/login",userAuth , async (req, res)=> {
try {
    const { emailID, password } = req.body;

    const user = await User.findOne({emailID : emailID});

    if (!user) {
        throw new Error("Invalid credentials");
      }

    const isPasswordValid = await validatePassword(password);

    if(isPasswordValid) {
        const token =await user.getJWT();

        res.send("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
          });
          res.send("Login Successful!!!");
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (err) {
        res.status(400).send("ERROR : " + err.message);
      }
    });
    
module.exports = authRouter;