const req = require("express/lib/request");
const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const sectionSchema = new mongoose.Schema({
    sectionName:{
        type:String,
    },
    subSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubSection"
        }
    ]
});
module.export = mongoose.model("Section",sectionSchema);
