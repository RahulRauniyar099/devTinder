const mongoose = require("mongoose")


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://raulrauniyar09:grSzI0gqxovs5h7I@namastenode.xyvctc4.mongodb.net/devTinderDatabase?retryWrites=true&w=majority&appName=namasteNode")

}


module.exports = connectDB

