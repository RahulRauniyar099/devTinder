 const adminAuth = (req,res,next) => {
    const token = "ab11c";
    const isAuthorized = token === "ab11c";

    if(!isAuthorized){
        res.status(401).send("unauthorized")
    }
    else{
        next()
    }
} 

 const userAuth = (req,res,next) => {
    const token = "ab11c";
    const isAuthorized = token === "ab11c";

    if(!isAuthorized){
        res.status(401).send("unauthorized")
    }
    else{
        next()
    }
} 

module.exports ={ adminAuth, userAuth }