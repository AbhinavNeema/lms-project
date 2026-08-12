import { genToken } from "../configs/token.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import sendMail from "../configs/Mail.js"
import crypto from "crypto"

const ssoCodes = new Map(); // In-memory store for SSO codes

export const signUp=async (req,res)=>{
    try {
        let {name,email,password,role}= req.body
        let existUser= await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"email already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Please enter valid Email"})
        }
        if(password.length < 8){
            return res.status(400).json({message:"Please enter a Strong Password"})
        }
        
        let hashPassword = await bcrypt.hash(password,10)
        let user = await User.create({
            name ,
            email ,
            password:hashPassword ,
            role,
        })
        let token = await genToken(user._id)
        
        // 👇 UPDATED COOKIE SETTINGS
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,          // Must be true for cross-origin
            sameSite: "none",      // Must be none for Vercel -> Render communication
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        return res.status(201).json(user)

    } catch (error) {
        console.log("signUp error")
        return res.status(500).json({message:`signUp Error ${error}`})
    }
}

export const login=async(req,res)=>{
    try {
        let {email,password}= req.body
        let user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }
        let isMatch =await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"incorrect Password"})
        }
        let token =await genToken(user._id)
        
        // 👇 UPDATED COOKIE SETTINGS
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,          // Must be true for cross-origin
            sameSite: "none",      // Must be none for Vercel -> Render communication
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
            
        return res.status(200).json(user)

    } catch (error) {
        console.log("login error")
        return res.status(500).json({message:`login Error ${error}`})
    }
}



export const logOut = async (req, res) => {
  try {

    // reset usage session
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, {
        continuousUsageMinutes: 0,
        currentSessionStart: null,
      });
    }

    // clear auth cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "logOut Successfully" });

  } catch (error) {
    return res.status(500).json({ message: `logout Error ${error}` });
  }
};

export const googleSignup = async (req,res) => {
    try {
        const {name , email , role} = req.body
        let user= await User.findOne({email})
        if(!user){
            user = await User.create({
                name , email ,role
            })
        }
        let token =await genToken(user._id)
        
        // 👇 UPDATED COOKIE SETTINGS
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,          // Must be true for cross-origin
            sameSite: "none",      // Must be none for Vercel -> Render communication
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
         return res.status(500).json({message:`googleSignup  ${error}`})
    }
}

export const sendOtp = async (req,res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp=otp,
        user.otpExpires=Date.now() + 5*60*1000,
        user.isOtpVerifed= false 

        await user.save()
        await sendMail(email,otp)
        return res.status(200).json({message:"Email Successfully send"})
    } catch (error) {
        return res.status(500).json({message:`send otp error ${error}`})
    }
}

export const verifyOtp = async (req,res) => {
    try {
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now() ){
            return res.status(400).json({message:"Invalid OTP"})
        }
        user.isOtpVerifed=true
        user.resetOtp=undefined
        user.otpExpires=undefined
        await user.save()
        return res.status(200).json({message:"OTP varified "})
    } catch (error) {
         return res.status(500).json({message:`Varify otp error ${error}`})
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {email ,password } =  req.body
         const user = await User.findOne({email})
        if(!user || !user.isOtpVerifed ){
            return res.status(404).json({message:"OTP verfication required"})
        }

        const hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword
        user.isOtpVerifed=false
        await user.save()
        return res.status(200).json({message:"Password Reset Successfully"})
    } catch (error) {
        return res.status(500).json({message:`Reset Password error ${error}`})
    }
}

export const generateSsoCode = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Generate a random 32-character hex string
        const code = crypto.randomBytes(16).toString('hex');
        
        // Save the code and tie it to the logged-in user's ID
        ssoCodes.set(code, req.userId);
        
        // Self-destruct the code after 60 seconds so it can't be stolen and used later
        setTimeout(() => ssoCodes.delete(code), 60000); 
        
        return res.status(200).json({ code });
    } catch (error) {
        console.log("generateSsoCode error", error);
        return res.status(500).json({ message: `SSO Code Generation Error: ${error}` });
    }
};

export const exchangeSsoCode = async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ message: "Code is required" });
        }

        // Check if the code exists and hasn't expired
        const userId = ssoCodes.get(code);
        if (!userId) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }

        // 🛡️ CRUCIAL: Immediately delete the code so it is strictly One-Time Use
        ssoCodes.delete(code);

        // Find the user to return their data along with the token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate the standard JWT token
        const token = await genToken(userId); 
        
        // Return the token and user in the JSON response
        return res.status(200).json({ token, user });

    } catch (error) {
        console.log("exchangeSsoCode error", error);
        return res.status(500).json({ message: `SSO Exchange Error: ${error}` });
    }
};