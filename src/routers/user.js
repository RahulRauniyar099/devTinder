const express = require("express");
const routerUser = express.Router();

const {userAuth} = require("../middleware/auth")
const ConnectionRequest = require("../model/connectionRequest");

routerUser.get("/user/request/received", userAuth, async (req,res) =>{
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
           toUserId:  loggedInUser._id,
           status: "interested"
        }).populate("fromUserId", ["firstName"])

        if(!connectionRequest){
            throw new Error("Not valid")
        }
        res.json({message: "All details fetched" ,
             data: connectionRequest})
        
    } catch (error) {
        res.status(404).json({message: "Invalid connevction" + error.message})
        
    }
})

module.exports = routerUser;