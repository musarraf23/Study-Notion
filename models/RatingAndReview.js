const mongoose= require("mongoose");
const ratingAndReview = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Type.ObjectId,
        required:true,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    }
})
module.exports = mongoose.model("RatingAndReview",ratingAndReview);
 