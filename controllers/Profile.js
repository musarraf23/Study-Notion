const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req,res)=>{
    try{
        //get data
        const {dateOfBirth="" , about="",contactNumber , gender} = req.body;

        //get userId
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:'All field are required',
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber =contactNumber;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated Successfully',
            profileDetails,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
        })

    }
}
exports.deleteAccount = async(req,res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation
        if(!id){
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //TODO : how unenrolled user form all enrolled course
        //delete user
        await User.findByIdAndDelete({_id:id});
        //return resposne
        return res.status(200).json({
            success:true,
            message:'User Deleted Successfully',

        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Internal server error',
        })

    }
}
exports.getAllUserDetails = async(req,res)=>{
    try{
        //get id 
        const id = req.user.id;
        // validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //retuen resposne
        return res.status(200).json({
            success:true,
            message:'Tag created successfully',
        })


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}