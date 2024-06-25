const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const courseProgress = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.objectId,
        ref:"Course",
    },
    completedVideos:{
        type:mongoose.Schema.ObjectId,
        ref:"SubSection",
    }
});
module.export = mongoose.model("CourseProgress",courseProgress);
