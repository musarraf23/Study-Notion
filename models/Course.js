const mongoose = require("mongoose");
const Category = require("./Category");
const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDrescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        types:String,
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }],
    ratingAndReview:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    },
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type: [String],
        ref:"Tag",
    },
    Category:{
        type:mongoose.Schema.Types.ObjectId,
    },
    studentEnrolled:{
        type:mongoose.Schema.Type.ObjectId,
        required:true,
        ref:"User"
    },
});
module.exports = mongoose.model("course",courseSchema);
