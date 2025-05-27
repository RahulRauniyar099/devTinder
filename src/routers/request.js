const express = require("express");
const requestRouter = express.Router();
const User = require("../model/user")
const { userAuth } = require("../middleware/auth");



requestRouter.post("/connectionRequestSend", userAuth, async (req, res) => {

    const user = req.user
    console.log("connection sent")
    res.send(user.firstName, + "request connection sent");

})


module.exports = requestRouter;