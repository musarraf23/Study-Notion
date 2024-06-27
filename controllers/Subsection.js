const Subsection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader"); 
//create Sub section 
exports.createSubsection = async(req,res)=>{
    try{
        //fetch data from reques body
        const {sectionId , title , timeDuration , description} = req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration ||!description || !video ){
            return res.status(400).json({
                success:false,
                message:'All field are required',
            });
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create a sub -section
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secureUrl,
        })
        
        //update section with sub section object id
        const updatedSection =await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSection:subSection._id
                },
            },
            {new:true},
        );

        
        //return resposne
        return res.status(200).json({
            success:false,
            message:'Sub Section Careted succesfully',
            uploadSection,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Internal Server ERROR',
            error:error.message,
        })
    }
}
//HW: UPDATE SUB SECTION
exports
//HW: DELETE SUB SECTIOON
