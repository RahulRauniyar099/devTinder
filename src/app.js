const express = require("express");

const app = express();


//optional  
// app.get(/^\/ab?c$/, (req, res) => {
//     console.log("knjbj");
    
//     res.send("Matched either /ac or /abc");
// });

// app.get(/^\/ab+c$/, (req,res) => {
//     res.send("Data is send")
// })

//mutliple route handlers

app.use("/user", (req,res,next) => {

    // res.send("Response")
    next();

},
(req,res, next) => {
    // res.send("2nd response!!")
    next()
},
(req,res,next) => {
    res.send("3rd response")
}

)



app.listen(3000, () => {
    console.log("Port running on 3000");
    
});