const Section = require("../models/Section");
const Course = require("../models/Course");

expports.CreateSection = async (req, res) => {
    try {
        //data fetch 
        const { sectionName, courseId } = req.body;
        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }
        //create section
        const newSection = await Section.create({ SectionName });

        //update course with section
        const updateCourse = await Course.findByIdAndUpdate(
            CourseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true },
        )
        //HW : use populate to replace Section / sub section both in the updated course details
        //return response
        return res.status(200).json({
            success: true,
            message: 'Section created Successfully',
            updatedCourseDetails,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to create Section, please try again',
            error: error.message,
        })
    }
}
exports.updateSection = async (req, res) => {
    try {
        //data fetch
        const { SectionName, SectionId } = req.body;
        //data validation
        if (!SectionName || !SectionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing properties',
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        //return response
        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
        })
    }
    catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Unable to update Section, please try again',
            error: error.message,

        })

    }

}
exports.deleteSection = async (req, res) => {
    try {
        //get id assuming we are sending id in params
        const { SectionId } = req.body
        await Section.findByIdAndDelete(SectionId);
        //use find by id and deleted

        //return response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Succesfully",
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to update Section, please try again',
            error: error.message,

        })
    }
}