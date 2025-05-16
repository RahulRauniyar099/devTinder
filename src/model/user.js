const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
    },
    lastName: {
        type: String

    },

    emailId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new error("Error is thrown")
            }
        }
    },

    photoUrl : {
        type : String,

    },
    about: {
        type: String,
        default: "This is default value",
    },
    skills: {
        type:[String]
    }

})


module.exports= mongoose.model("User", userSchema)
