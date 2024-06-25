
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin","Student","Instructor"],

    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    course:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Course",
        }

    ],
    image:{
        type:String,
        required:true,
    },
    courseProgress :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"courseProgress",
        }
    ],



})
module.exports = mongoose.model("User",userSchema);