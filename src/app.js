const express = require("express");
 const connectDB = require("./config/database")

const app = express();

connectDB().then(() => {

    console.log("Database conncetion is successfull");

    app.listen(3000, () => {
    console.log("Port running on 3000");
    
});
    
}).catch(err =>{
console.error("CONNECTION NOT ESTABLISHED");

})





