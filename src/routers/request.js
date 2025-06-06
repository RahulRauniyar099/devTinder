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

//make API call for Accepted & Rejected
//1.check user is valid (loggedIn)
//2. check allow status
//3. requestId is valid or not


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status is not as expected" });
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      
      _id: requestId,
      toUserId: loggedInuser._id,
      status: "interested"
    });


    if (!connectionRequest) {
      return res.status(404).json({ message: "Invalid request" });
    }

    connectionRequest.status = status;
    
    await connectionRequest.save();

    res.status(200).json({ message: `Connection ${status}` });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = requestRouter;