const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//authentication middleware for user request every
exports.auth = async(req,res,next) =>{
    try{
        //extracting jwt from request body , cookie ,header or body
        const token = req.cookies.token ||
        req.body.token ||
        req.header("Authorisation").replace("Bearer ","");

        //if jwt is missing , return 401 Unauthorised response
        if(!token)
            {
                //verify the jwt using the secret key stored in enviroment variable
                return res.status(401).json({
                    success:false,
                    message:'Token is missing',
                })
            }
            try{
                //verify the jwt using scret key stored in enviroment variable
                const decode = await jwt.verify(token,process.env.JWT_SECRET);
                console.log(decode);
                //storing the decoded JWT playload in the request object for further use
                req.user = decode;
            }
            catch(error){
                //if jwt verification v=failed

                return res.status(401).json({
                    success:false,
                    message:'Token is Invalid',
                });
                
            }
            //if jwt is valid move on to the next middleware or request handler
               
            next();
    }
    catch(error){
        //If there an error occured during the authentication process ,return 401 Unauthorised response
        return res.status(401).json({
            success:false,
            message:'Something Went wronwhile validation the token'
        });
    }
}
//isStudent
exports.isStudent = async(req,res,next) =>{
    try{
        const {email}=req.body;
        const userDetails = await User.findOne({email});
        if(userDetails.accountType!=="Student");
        {
            return res.status(401).json({
                success:false,
                message:'This is protected Route for student',
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cant be verified',
        })
    }
};
exports.isAdmin = async(req,res,next)=>{
    try{
        const {email }=req.body;
        const userDetails = await User.findOne({email});
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:'This is not protected route for Admin',
            });
      
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User Role cant be verified'

        })
    }
};

//isInstructor
exports.isInstructor = async(req,res,next)=>{
   try{
    const {email} = req.body;
    const userDetails = await User.findOne({email});
    if(userDetails.accountType!=="Instructor"){
        return res.status(401).json({
            success:false,
            message:'This is not a protected route for a Instructor',
        });

    }
    next();
   }
   catch(error){
    return res.status(500).json({
        success:false,
        message:'User role cant be verified',
    });
   }
};


//isAdmin

