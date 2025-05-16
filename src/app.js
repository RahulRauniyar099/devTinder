const express = require("express");
const connectDB = require("./config/database")
const User = require("./model/user")

const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
    unique = true

        res.send("User added successfully");
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send("Email already exists");
        } else {
            res.status(400).send(`Data not added: ${err.message}`);
        }
    }
});


//find by email

app.get("/user", async (req, res) => {

    const findbyEmail = req.body._id;

    try {

        const userEmail = await User.findById({ _id: findbyEmail })
        res.send(userEmail)
    }
    catch (err) {
        res.status(400).send("something went wrong")

    }
})



//feedApi 
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({})
        if (users === 0) {
            res.status(404).send("Error")

        } else {
            res.send(users)

        }

    }
    catch (err) {
        res.status(404).send("Error")
    }

})

//deleteApi

app.delete("/delete", async (req, res) => {

    const userDelete = req.body.userId
    console.log("11111", userDelete)
    try {
        const user = await User.findByIdAndDelete(userDelete)
        if (user === 0) {
            res.status(404).send("Data not found")

        } else {
            res.send(user)
        }

    } catch (err) {
        res.status(404).send("Data not found")
    }
})


//update API

app.patch("/update", async (req, res) => {
    const userUpdate = req.body
    const userId = req.body.userId
    try {
        res.send(await User.findByIdAndUpdate({ _id: userId }, userUpdate,{ runValidators: true}))
        



    } catch {
        res.status(404).send("something went wrong")
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





