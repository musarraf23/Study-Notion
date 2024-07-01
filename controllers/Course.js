const Course = require("../models/Course");
const Tag = require("../models/Course");
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create course handler function
exports.createCourse = async(req,res)=>{
    try{
        
        const {courseName,courseDescription,whatYouWillLearn , price , tags} = req.body;
        //get thumbnails
        const {thumbnail} = req.files.thumbnailImage;      
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tags ){
            return res.status(400).json({
                success:false,
                message:'All field are required',
            })
        }
        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details not found", instructorDetails);
        //fetch data
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }
        
        //check given tag valid or not
        const CategorysDetails =await Category.findById(tag);
        if(!CategorysDetails){
            return res.status(404).json({
                success:true,
                message:'Tag Details not found',
            });
        }
        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        // create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructor._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tags:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
            
        })
        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            { _id:instructorDetails._id},
            {
                $push:{
                    course:newCourse._id,
                }
            },
            {new:true},
            
        );
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully ",
            date:newCourse,
        });
        
    }
    
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create course',
            error:error.message,
        })   
    }
}

exports.showAllCourses = async(req,res)=>{
    try{
        //todo: change the below state incremental
        const allCourse = await Course.find({});
        return res.status(200).json({
            success:true,
            message:'Data for all course fetched successfully',
            data:allCourse,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot fetch course Data',
            error:error.message,
        })
    }
}
