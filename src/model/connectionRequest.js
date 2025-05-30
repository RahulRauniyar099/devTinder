const { default: mongoose } = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
       
    },
    status :{
        type: String,
        required: true,
         enum: {
            values: ["ignore", "accepted", "rejected", "interested"],
            message: `{VALUE} is not correct`
        }
    }

    
},
{
    timestamps: true,
}
)

//look in below code

// connectionRequestSchema.pre("save", function(next) {
    
//     const connectionRequest = this;
//     if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//         return next(new Error("Cannot send a connection request to yourself"));
//     }
//     next();
// });

//compound indexing
connectionRequestSchema.index({fromUserId: 1, toUserId: 1}) 

//  indexing 
// connectionRequestSchema.index({fromUserId: 1})


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;