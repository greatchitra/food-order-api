const express = require('express');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const sentOtp = require('../utils/sentOtp');
const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    
        try {
            const { emailId, password } = req.body;
            const user = await User.findOne({ emailId });
            if (!user) {
                throw new Error("Invalid Credential!!!");
            }
            const isPasswordValid = await user.validatePassword(password);
            if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credential!!!" });
    
                // creating jwt token 
                const token = await user.getJWT();
                res.cookie("token", token, {
                     httpOnly: true,  // Prevents JavaScript from accessing the cookie
                secure: true,    // Required for HTTPS (Remove if testing on localhost)
                sameSite: "None", // Required for cross-origin requests
                    expires: new Date(Date.now() + 8 * 3600000) 
                });
                res.json({
                    success: true,
                    token,  
                    user: {
                        _id: user._id,
                        name: user.name,
                        emailId: user.emailId,
                        role: user.role,
                        imageUrl : user.imageUrl,
                    }
                });
    
            
        } catch (err) {
            res.status(400).send("Error:- " + err.message)
        }
    });


authRouter.post('/signup', async (req, res) => {
    try {
        const { name, emailId, password, role } = req.body;
        const user = await User.findOne({ emailId });
        if (user) {
            throw new Error("EmailId already exists!!!");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const newUser = new User({ name, emailId, password: hashedPassword, role, otp });
        const saveUser = await newUser.save();
        await sentOtp(emailId, otp);



        res.json({ message: "otp sent successfully" });

    } catch (error) {
        res.status(400).send("something went wrong:- " + error.message);
    }

});

authRouter.post("/verify", async (req, res) => {
    try {
        const { emailId, otp } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.otp !== otp) {
            throw new Error("Invalid OTP");
        }
        user.isVerified = true;
        user.otp = null;
        const saveUser = await user.save();

        const token = await saveUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000) 
        });

        res.json({ message: "user saved successfully", data: saveUser });

    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

authRouter.post('/forgotpassword', async (req, res) => {
    try {
        const { emailId } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("User not found");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();
        await sentOtp(emailId, otp);

        res.json({ message: "OTP sent to email" });

    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

authRouter.post('/resetpassword', async(req,res)=>{
    try {
        const {emailId, otp, newPassword }= req.body;;
        const user = await User.findOne({
            emailId
        });
        if(!user || user.otp!==otp || user.otpExpiry< Date.now()){
            return res.status(400).json({ message: "Invalid OTP or expired" });
        }
        user.password  = await bcrypt.hash(newPassword, 10);
          
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        res.json({ message: "Password reset successfully" });

        
    } catch (error) {
        res.status(500).json({ message: "Error resetting password" });
    }
})



authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),

    });
    res.send("logOut Successful!!!!!! ");
})

    module.exports = authRouter;
