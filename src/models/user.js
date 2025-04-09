const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    }, 
    lastName : {
        type : String,
        required : true,
    },
    age : {
        type : Number
    },
    emailID : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true, 
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error("Email address is not valid !!"+ value);
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error ("Passward shall contain 1 uppercase, 1 lowercase and number")
            }
        }
    },
    gender : {
        type : String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    about : {
        type : String,
        default : "This is a default about of the user !"
    },
    skills : {
        type :  [String],
    }
}, 
{
    timestamps : true
});

const User = mongoose.model("User", userSchema);

module.exports = User;