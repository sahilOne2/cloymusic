import express from "express"
import connectDb from "../mongodb.js";
import {User} from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import verifyToken from "../middleware/authMiddleware.js"
import nodemailer from "nodemailer"
import {google} from "googleapis"
import crypto from "crypto"
const router = express.Router();

connectDb()


router.post("/signup",async(req,res)=>{
    console.log(req.body);
    try{
      const {fullname,username,email,password} = req.body
      const salt = bcrypt.genSaltSync(10)
      const passwordHash = bcrypt.hashSync(password,salt)
      const user = new User({fullname,username,email,password:passwordHash})

      await user.save()

      const token = jwt.sign({userName:username,fullName:fullname},process.env.SECRET_KEY,{expiresIn:"1h"})


      res.cookie("token",token,{httpOnly:true,secure:false,maxAge:3600000})
      res.status(201).json({message:"Signed up successfully.",uname:username,fullName:fullname})
   }catch(err){
      if(err.code === 11000){
         const duplicateKey = Object.keys(err.keyPattern)[0]
         res.status(501).json({message:`${duplicateKey} already exists.`})
      }else{
        res.status(501).json({message:"Error signing up",error:err})
      }
   }
})
router.post("/login", async (req,res) =>{
   try{
     const {username,password} = req.body
     const user = await User.findOne({username:username})
     console.log(user);
     
     if(!user){
       return res.status(404).json({message: "No User Found"})
     }
     if(!bcrypt.compareSync(password,user.password)){
       return res.status(501).json({message: "Wrong Password"})
     }
     
     const token = jwt.sign({userName:username,fullName:user.fullname},process.env.SECRET_KEY,{expiresIn:"1h"})
     res.cookie("token",token,{httpOnly:true,secure:false,maxAge:3600000})
     res.status(201).json({message: "Logged In Successfully.",uname:username,fullName:user.fullname})

   }catch(error){
       res.status(500).json({message:"Internal Server Error."})
   }
})

router.get("/check-session",verifyToken,(req,res) => {
  res.status(201).json({loggedIn:true,user:{username:req.user.userName,fullName:req.user.fullName }})
})

router.post("/logout",(req,res) => {
  res.clearCookie("token")
  res.status(201).json({message: "Logged out successfully."})
})
const otpStore = {}
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
)
const transportmailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: "cdyd smej qjax hcio"
  }
})
async function sendOtp(email,otp) {
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: "Your Otp Code",
      text: `Your otp is ${otp}. Valid for 5 minutes.`
    }
    try{
      await transportmailer.sendMail(mailOptions)
      console.log("Otp sent successfully");
    }catch(error){
      console.error("Error sending otp",error)
    }
}
router.post("/send-otp",async (req,res) => {
  const {email} = req.body
  console.log(email);
  const user = await User.findOne({email:email})

  if(!user){
    return res.status(404).json({message: "No User Found"})
  }
  
  const otp = Math.floor(100000+Math.random()*900000).toString()
  otpStore[email] = {otp,expiresAt : Date.now()+5*60*1000}
  console.log(otpStore[email]);
  
  try{
    await sendOtp(email,otp)
    res.status(201).json({message:"Otp sent successfully."})
  }catch(error){
    res.status(500).json({message:"Error sending Otp.",error})
  }

})
router.post("/verify-otp",async (req,res) => {
  const {email,otp} = req.body
  if (!email || !otp) {return res.status(400).json({message: "Email and otp are required."}) }
  
  const storedOtp = otpStore[email].otp
  
  if(!storedOtp) {return res.status(400).json({message: "No otp for this email"})}

  if(Date.now() > storedOtp.expiresAt) {return res.status(400).json({message: "Otp expired"})}

  if(storedOtp !== otp){return res.status(400).json({message: "Invalid otp"})}
  
  delete otpStore[email];

  res.status(201).json({message: "Otp verified successfully."})
})
router.post("/reset-pass",async (req,res) => {
  const {email,newPass} = req.body
  
  const salt = bcrypt.genSaltSync(10)
  
  const passwordHash = bcrypt.hashSync(newPass,salt)
  try{
    await User.findOneAndUpdate({email:email},{password:passwordHash})
    res.status(201).json({message:"Password updated successfully."});
  }catch(error){
    res.status(400).json({message:"Error updating password.",error})
  }
})

export default router;