const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const {passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");


//signup
exports.signUp = async (req, res) => {
  try {
    //data fetch from the user body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPasssword,
      accountType,
      contactNumber,
      otp,
    } = await req.body;

    //validate karo password ko
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPasssword ||
      !otp
    ) {
      return res.status(403).json({
        success: true,
        message: "All fields are required",
      });
    }
    //2 password matching
    if (password !== confirmPasssword) {
      return res.status(400).json({
        success: false,
        mesaage:
          "password and confirmPassword are not matching , please try again later",
      });
    }
    //check if user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already registered",
      });
    }
    //find most recent OTP stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //validate OTP
    if (recentOtp.length == 0) {
      //otp ot found
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        mesaage: "Invalid OTP",
      });
    }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    let approved = ""
    approved === "Instructor" ? (approved = false) : (approved = true)
    //entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    //return res
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      mesaage: "Registration failed",
    });
  }
};
//login
exports.login = async (req, res) => {
  try {
    //fetch details from request
    const { email, password } = req.body;
    //validate
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All field are required , please try again ",
      });
    }
    //check for user exist or not
    const user = await User.findOne({ email }).populate("additionalDetails"); //not needed to populate
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not Registered,please signupp first",
      });
    }
    //pasword matching
    //generate jwt token
    if (await brcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      const token = jwt.signup(payload, process.env.JWT_SECRET, {
        expires: "2h",
      });
      user.token = token;
      user.password = undefined;
      //create cookie and send response
      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, option).status(200).json({
        success: true,
        token,
        user,
        mesaage: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: true,
        mesaage: "Password is incorrect",
      });
    }
    //create cookie and send response
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "Login failure please try again",
    });
  }
};


exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });
    //if it exist then send response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User ALready registered",
      });
    }
    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    //create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    //return response success
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//change Password
exports.changePassword = async(req,res)=>{
  try{
    //get user data from req user
    const userDetails = await User.findByIdAndUpdate(req.user.id);

    //get old password and new password andd confirm form req.body
    const { oldPassword , newPassword} = req.body;
    
    //validate old Password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if(!isPasswordMatch){
      //if old pasword match does not match return 401(unauthorized acces)
      return res.status(401).json({
        success:false,
        message:"The Password is incorrect",
      });
    }
    //update password
    const encryptedPassword = await bcrypt.hash(newPassword,10);
    const updatedUserDetails= await User.findByIdAndUpdate(
      req.user.id,
      {password:encryptedPassword},
      {new:true},
    )
    //send notification email
    try{
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for you account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password Updated succesfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent Successfully : ",emailResponse.response);
    }
    catch(error){
      //if there is an erro sending email ,log the error and reyurn a 500 (internal server)
      console.log("Error occured while sending email",error);
      return res.status(500).json({
        success:false,
        message:'Error occured while updating password',
        error:error.mesaage,
      })
    }
    //return success response
    return res.status(200).json({
      success:true,
      message:'Password Updated Successfully',
    })
  }

  catch(error){
    //if there is an error updating the password , log the error and return a 500 (Internal server error)
    console.log("Error occcured while updating the password : ", error);
    return res.status(500).json({
      succes:false,
      message:'Error Ocuured while updating the Password ',
      error:error.message,
    })
  }
}