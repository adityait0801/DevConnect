const mongoose = require("mongoose");

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
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        minLen : 8
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