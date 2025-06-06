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
        console.log("uuu", loggedInUser);
        

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id, status: "accepted",

                },
                {
                    fromUserId: loggedInUser._id, status: "accepted",

                },
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about"])
            .populate("toUserId", ["firstName", "lastName", "photoUrl", "about"])
            

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

    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Get all connection requests involving the logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    // Build a set of user IDs to exclude (connected + self)
    const hideUserFeed = new Set();
    hideUserFeed.add(loggedInUser._id.toString());

    connectionRequests.forEach(req => {
      hideUserFeed.add(req.fromUserId.toString());
      hideUserFeed.add(req.toUserId.toString());
    });

    // Fetch users not already connected
    const users = await User.find({
      _id: { $nin: Array.from(hideUserFeed) }
    })
      .select("firstName lastName age gender photoUrl")
      .skip(skip)
      .limit(limit);

    res.status(200).send(users);
  } catch (err) {
    console.error("Feed Error:", err);
    res.status(400).send("Feed is not proper: " + err.message);
  }
});


module.exports = routerUser;