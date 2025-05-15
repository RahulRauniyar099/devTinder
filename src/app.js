const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middleware/auth")

//as we have authorization which will work for other routes as well that's the reason we use middleware
app.use("/admin", adminAuth )

app.get("/user", userAuth, (req,res) => {
    res.send("Check user Auth")
})

app.get("/admin/getUserData", (req,res) =>{
    res.send("All Data sent to user")
})

app.delete("/admin/deleteUser", (req,res) => {
    res.send("Deleted the data")
})



app.listen(3000, () => {
    console.log("Port running on 3000");
    
});