const express = require("express");

const app = express();

// it will only make call to get method
app.get("/user", (req,res) => {
    res.send({firstname: "Rahul", lastname: "Rauniyar"})
})


app.post("/user",(req,res) => {
    res.send("Post is tested")
})


app.delete("/user",(req,res) => {
    res.send("delete is tested")
})


app.patch("/user",(req,res) => {
    res.send("Patch is tested")
})


// It will matches all the HTTP API calls

app.use("/test",(req,res) => {
    res.send("Hello world")
})


app.listen(3000, () => {
    console.log("Port running on 3000");
    
});