const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");

//capture the payment and infinite the razorpay order

exports.capturePayment = async (req, res) => {
    //get courseId and userId 
    const { course_id } = req.body;
    const userId = req.user.id;
    //validation
    if (!course_id) {
        return res.json({
            success: false,
            message: 'Please provide course id',
        })

    }
    //validation coursedetails
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: 'Could not find the course',
            });
        }
        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
           return res.status(200).json({
            success:false,
            message:'Student is already enrolled',
           });
        }

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount : amount*100,
        currency,
        reciept : Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
    };
    try{
        const paymentResposnse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return  res.json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });

    }
    catch(error){
        console.log(error);
        return res.json({
            success:false,
            message:'Could not initiate order',
        });
    }
};


exports.verifySignature = async(req,res)=>{
    const webhookSecret = req.body = "12345678"
    const signature = req.header["x-rozarpay-signature"];
    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    if(signature===digest){
        console.log("Payment is Authorized");
        const {courseId,userId} = req.body.payload.payment.entity.notes;
        try{
            //full fill the action
            //find the course and enroll in ti
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentEnrolled:userId}},
                {new:true},
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:'Course not found',
                });
            } 
            console.log(enrolledCourse);
            //find the student and add the course to their list enrolled 
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulation form Musarraf",
                "congratulation, you onboard into new codehelp Course",
            );
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:'Signature Verified and Course Added',
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else{
        return res.status(400).json({
            success:false,
            message:'Invalid Request',
        })
    }
}; 
