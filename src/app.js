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


//find by email

app.get("/user", async (req,res) => {
    const findbyEmail = req.body.emailId;

    try{
        const userEmail = await User.find({emailId: findbyEmail})
        res.send(userEmail)
    }
    catch(err){
        res.status(400).send("something went wrong")

    }
})



//feedApi 
app.get("/feed", async (req,res) => {

    try{
        const users = await User.find({})
        if(users === 0){
        res.status(404).send("Error")

        }else {
        res.send(users)

        }

    }
    catch(err){
        res.status(404).send("Error")
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





