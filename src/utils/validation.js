const validator = require("validator")

const validateSignupData = (req) => {
    const { firstName, lastName, password, emailId} = req.body
    if(!firstName || !lastName ) {
        throw new Error("Name can't be empty")
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("Email id is wrong")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be strong")

    }
}

module.exports = {
    validateSignupData
}