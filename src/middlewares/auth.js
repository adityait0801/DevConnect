const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth =async (req, res, next)=> {
try{
    const { token } = req.token;
    
    if (!token) {
        throw new Error("Token is not valid!!!!!!!!!");
    };

    const decodedMessage = await jwt.verfy(token, "DevTinder1*");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
          throw new Error("User does not exist");
        }
        res.send(user);
      } catch (err) {
        res.status(400).send("ERROR : " + err.message);
      }
      req.user = user;
      next();
}

module.exports = userAuth;