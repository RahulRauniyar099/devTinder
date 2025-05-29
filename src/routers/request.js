const express = require("express");
const requestRouter = express.Router();
const User = require("../model/user")
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../model/connectionRequest");



requestRouter.post("/request/send/:status/:touserId", userAuth, async (req, res) => {
try{
    const fromUserId = req.user._id
    const toUserId = req.params.touserId
    const status = req.params.status
        console.log("why", fromUserId, toUserId)


      if (fromUserId == toUserId) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    //allowed status
    const allowedStatus = ["ignore", "interested"]
    if(!allowedStatus.includes(status)){
        return res.status(404).send("Invalid status", + err.message)
    }

    const existUserId = await User.findById(toUserId);
    if(!existUserId){
         res.status(404).json({message: "User not found"})
    }

    //check connectionn request already sent or sent from another side!!

    const existConnectionrequest = await ConnectionRequestModel.findOne({
        $or: [
            {fromUserId, toUserId},
            { fromUserId: toUserId, toUserId: fromUserId}
        ]
    })

    

    if(existConnectionrequest){
      return res.status(400).send("Request already sent")
    }

   

    const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
    })

    connectionRequest.save();
    res.json({
        message: "connection succesfull"
    })
}catch(err){
    res.status(400).send("message", + err.message)
}



})


module.exports = requestRouter;