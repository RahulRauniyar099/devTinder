const jwt = require("jsonwebtoken");

const User = require("../model/user")


const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Token not found")
        }

        const decodedJWT = jwt.verify(token, "Password");
        const { _id } = decodedJWT;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("USer not found")
        }
        req.user = user;
        next();

    } catch (err) {
        res.status(400).send("Token not valid" + err.message)
    }
}

module.exports = { userAuth }