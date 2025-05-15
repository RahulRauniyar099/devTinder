const express = require("express");
const connectDB = require("./config/database")
const User = require("./model/user")

const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {

    //creating new user or instance of Usermodel with userobj
    // const user = new User({
    //     firstName: " virat",
    //     lastName: "Rauniyar",
    //     Email: "virat@gmail.com",
    //     password: "virat",
    // })


    const user = new User(req.body)



    //it save in database and returns promise
    try{
   await user.save()
   res.send("User added successfully")
    } catch(err){
        res.status(400).send("Data not added", err.message)
    }
})

connectDB().then(() => {

    console.log("Database conncetion is successfull");

    app.listen(3000, () => {
        console.log("Port running on 3000");

    });

}).catch(err => {
    console.error("CONNECTION NOT ESTABLISHED");

})





