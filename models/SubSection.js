const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const subSectionSchema = new mongoose.Schema({
  title:{
    type:String,
  },
  timeDuration:{
    type:String,
  },
  Descriptiob:{
    type:String,
  },
  videoUrl:{
    type:String,
  }
});
module.export = mongoose.model("subSection",subSectionSchema);
