//signup , login, logout

const express = require("express");
const authRouter = express.Router();
const User = require("../model/user")
const jwt = require("jsonwebtoken");
const { validateSignupData } = require("../utils/validation")
const bcrypt = require("bcrypt")


authRouter.post("/signup", async (req, res) => {
    console.log("body", req.body)
    try {
        validateSignupData(req)


        const { firstName, lastName, emailId, password } = req.body

        //validation
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

//login API
authRouter.post("/login", async (req, res) => {
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

        const token = user.getJWT();

        // ✅ Correctly set token as cookie with name "token
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

//logout

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
       expires: new Date(Date.now()) 
    })
    res.send("LOgout Succesfull");
})

module.exports = authRouter;