import jwt from "jsonwebtoken"
import {config} from "dotenv"
config()

const verifyToken = (req,res,next) =>{
    const token = req.cookies?.token
    if(!token){ 
        return res.status(501).json({message: "No token found."})
    }

    jwt.verify(token,process.env.SECRET_KEY,(err,decoded) => {
        if(err){
            return res.status(501).json({message: "Token expired or not found."})
        }
        req.user = decoded
        next();
    })
    
}

export default verifyToken;