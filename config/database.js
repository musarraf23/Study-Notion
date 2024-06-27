const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.enc.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("DB Connected Successfully"))
    .catch((error)=>{
        console.log("DB ka connection Failed");
        console.error(error);
        process.exit(1);
    })
};
