const mongoose = require("mongoose");

const connectDB = async()=> {  
   await mongoose.connect("mongodb+srv://adityait0801:NHTcV94FFkWhxDOd@devconnect.6jzuhf8.mongodb.net/?retryWrites=true&w=majority&appName=DevConnect"); 
}

connectDB();

module.exports = {connectDB}