const express = require("express");

const app = express();

app.use("/hello",(req, res) => {
    res.send("route");
    
});

app.use("/test",(req,res) => {
    res.send("Hello world")
})

app.listen(3000, () => {
    console.log("Port running on 3000");
    
});