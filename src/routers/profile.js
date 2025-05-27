const express = require("express");
const profileRouter = express.Router();
const User = require("../model/user")
const { userAuth } = require("../middleware/auth");
const { validateProfileEdit, validatePasswordEdit } = require("../utils/validation");



//profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {

        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(401).send("Access denied: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req,res) =>{

    try{
        if(!validateProfileEdit(req)){
            throw new Error("Not user");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        await loggedInUser.save();
        res.json(
            "profile Update successfully!!"
        )

    }catch(err){
        res.status(400).send("Data not valid" + err.message)
    }
})

const bcrypt = require("bcrypt");

profileRouter.patch("/profile/update/password", async (req, res) => {
  try {
    const { emailId, password, newPassword } = req.body;

    if (!emailId || !password || !newPassword) {
      return res.status(400).send("Missing required fields");
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Incorrect current password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    res.send("✅ Password updated successfully!");
  } catch (err) {
    res.status(500).send("❌ Failed to update password: " + err.message);
  }
});





module.exports = profileRouter;