const express = require("express");
const routerUser = express.Router();

const { userAuth } = require("../middleware/auth")
const ConnectionRequest = require("../model/connectionRequest");
const { set } = require("mongoose");
const User = require("../model/user")

routerUser.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName"])

        if (!connectionRequest) {
            throw new Error("Not valid")
        }
        res.json({
            message: "All details fetched",
            data: connectionRequest
        })

    } catch (error) {
        res.status(404).json({ message: "Invalid connevction" + error.message })

    }
})

routerUser.get("/user/connection", userAuth, async (req, res) => {
    try {


        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id, status: "accepted",

                },
                {
                    fromUserId: loggedInUser._id, status: "accepted",

                },
            ]
        }).populate("fromUserId", ["firstName", "lastName"])
            .populate("toUserId", ["firstName", "lastName"])

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id == loggedInUser._id) {
                return toUserId;
            } else {
                return row.fromUserId;
            }
        })

        res.json({ data })
    } catch (err) {
        res.status(400).send("connection default" + err.message)
    }
})


routerUser.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10
        const pageNumber = (page-1) * limit;

        //find all connections
        const connectionRequests = ConnectionRequest.find({
            $or: [{
                fromUserId: loggedInUser._id
            },
            { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId")




        // hidden user
        // set() it takes new a\value like a,b,c but don't take duplicate 
        const hideUserFeed = new Set();

        if (Array.isArray(connectionRequests)) {
            connectionRequests.forEach((req) => {
                hideUserFeed.add(req.fromUserId.toString());
                hideUserFeed.add(req.toUserId.toString());
            })
        } 



        const user = await User.find({
            $and: [{ _id: { $nin: Array.from(hideUserFeed) } },
            { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName").skip(pageNumber).limit(limit)
        res.send(user)

    } catch (err) {
        res.status(400).send("Feed is not proper" + err.message)
    }
})

module.exports = routerUser;