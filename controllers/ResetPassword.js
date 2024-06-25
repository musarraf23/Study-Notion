const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt =  require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async(req,res) =>{
    try{
        const email = req.body.email;
        const user= await User.findOne({email:email});
        if(!user){
            return res.json({
                success:true,
                message:`This Email: ${email} is not registered with us enter a valid email `,
            });
        }
        //const token = crypto.randomUUID();
        const token =crypto.randomBytes(20).toString("hex");
        const updateDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now() + 3600000,
            },
            {new:true}
        );
       console.log("DETAILS",updatedDetails);
       const url =`http://localhost:3000/update-password/${token}`;
       await mailSender(
        email,
        "Password reset",`your link for email verification is${url}. Please click this url to reset your password. `
       );
       res.json({
        success:true,
        message:'Email Sent Successfully , Please Check your email to continue further',
       });
    }
    catch(error){
        res.json({
            error:error.message,
            success:false,
            message:`Some error in sending the Reset Message`,
        });

    }
}

exports.resetPassowrd = async(req,res)=>{
    try{
        const {password , confirmPassword ,token} = req.body;
        if(confirmPassword!==password){
            return res.json({
                success:false,
                message:'Password and Confirm Password Does not match',
            });
        }
        const userDetails = await User.findOne({token:token});
        if(!userDetails){
            return res.json({
                success:false,
                message:'Token is Invalid',
            });
           
        }
        if(!userDetails){
            return res.json({
                success:false,
                message:'Token is Invalid',
            })       

        }
        if(userDetails.resetPasswordExpires > Date.now()){
            return res.json({
                success:false,
                message:'Token is Expired , please Regenerate Your Token',
            });
        }
        const encryptedPassword = await bcrypt.hash(password,10);
        await User.findOneAndUpdate(
            {token:token},
            {password:encryptedPassword},
            {new:true}
        );
        res.json({
            success:true,
            message:'Password Reset Successful',
        })
    }
    catch(error){
        return res.json({
            error:error.message,
            success:false,
           message: `Some Error in Updating the Password`,
        });
    }
};


