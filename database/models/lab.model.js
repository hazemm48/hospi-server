import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
name:String,
price:String,
category:String,
date:Date,
patientId :{
    type : mongoose.Types.ObjectId,
    ref:"User"
},
}
)


const labModel = mongoose.model('lab',labSchema)

export default labModel;