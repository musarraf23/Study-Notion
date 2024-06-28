const mongoose  = required("mongoose");
const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    desciption:{
        type:String,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },

});
module.exports = mongoose.model("Category",categorySchema);