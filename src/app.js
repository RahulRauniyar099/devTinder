const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middleware/auth")

//as we have authorization which will work for other routes as well that's the reason we use middleware
app.use("/admin", adminAuth )

app.get("/user", userAuth, (req,res) => {
    res.send("Check user Auth")
})

app.get("/user/login", (req,res)=>{
    res.send("Login is without auth")
})

app.get("/admin/getUserData", (req,res) =>{
    try{
    res.send("All Data sent to user")
    }
    catch(err){
        res.status(500).send("Messsage giving error")

    }
})

app.delete("/admin/deleteUser", (req,res) => {
    res.send("Deleted the data")
})


// error handling best ways is using try catch
app.use("/", (err,req,res,next) => {
    if(err){
        res.status(500).send("Error handled");
    }
   
})


app.listen(3000, () => {
    console.log("Port running on 3000");
    
});