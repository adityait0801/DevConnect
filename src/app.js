const express = require('express');

const app = express(); //instance of the express is created here

app.use("/test", (req, res)=> {     //To handle the incoming request we use this. 
    res.send("Hello from the Server");  //this function is called request handler function
})

app.use("/hello", (req, res)=> {     //To handle the incoming request we use this. 
    res.send("Hello");  //this function is called request handler function
})

app.listen(3000, ()=> {
    console.log("Server is running on PORT 3000");
});

