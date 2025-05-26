const express = require("express");
const connectDB = require("./config/database")
const User = require("./model/user")
const { validateSignupData } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {


    try {

        const { firstName, lastName, emailId, password } = req.body
        //validation
        validateSignupData(req)

        //encrypt password
        //install npm i bcrypt


        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        });


        await user.save();
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
app.get("/feed", userAuth,async (req, res) => {

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

app.patch("/update/:userId", async (req, res) => {
    const userUpdate = req.body
    const userId = req.params?.userId
    try {

        const UPDATE_ALLOWED = ["userId", "firstName", "age", "gender"]
        const isAllowedUpdate = Object.keys(userUpdate).every((k) => UPDATE_ALLOWED.includes(k))

        if (!isAllowedUpdate) {
            throw new Error("some fields cann't be updated")
        }

        res.send(await User.findByIdAndUpdate({ _id: userId }, userUpdate, { runValidators: true }))




    } catch {
        res.status(404).send("something went wrong")
    }
})

//login API


app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send("Login failed: Incorrect password");
        }

        const token = jwt.sign({ _id: user._id }, "Password", { expiresIn: "1d" });

        // ✅ Correctly set token as cookie with name "token"
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Lax"
        });

        res.send("Login successful");
    } catch (err) {
        res.status(500).send("Server error: " + err.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {

        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(401).send("Access denied: " + err.message);
    }
});



connectDB().then(() => {

    console.log("Database conncetion is successfull");

    app.listen(3000, () => {
        console.log("Port running on 3000");

    });

}).catch(err => {
    console.error("CONNECTION NOT ESTABLISHED");

})





