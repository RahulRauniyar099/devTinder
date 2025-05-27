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

const validateProfileEdit = (req) => {
    const isAllowedEditFields = [
        "firstName",
        "lastName",
        "age",
        "gender",

    ]

    const isAllowedEdit = Object.keys(req.body).every((field)=>
        isAllowedEditFields.includes(field)
    
)
return isAllowedEdit;
}

const validatePasswordEdit = (req) => {
    const isPasswordEditAllowed = [
        password
    ]
    const isPwEditAllowed = Object.keys(req.body).every((field) =>
    isPasswordEditAllowed.includes(field)
)
return isPwEditAllowed;
}

module.exports = {
    validateSignupData,
    validateProfileEdit,
    validatePasswordEdit,
}