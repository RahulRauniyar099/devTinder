const express = require("express");
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")

const app = express();

app.use(express.json())
app.use(cookieParser())

//connection request 

const authRouter = require("./routers/auth")
const profileRouter = require("./routers/profile")
const requestRouter = require("./routers/request")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)


connectDB().then(() => {

    console.log("Database conncetion is successfull");

    app.listen(3000, () => {
        console.log("Port running on 3000");

    });

}).catch(err => {
    console.error("CONNECTION NOT ESTABLISHED");

})





