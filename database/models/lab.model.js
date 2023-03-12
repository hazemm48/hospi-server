import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
name:String,
price:String,
category:String,
date:Date,
anotherPerson:Boolean,
phone:String,
patientId :{
    type : mongoose.Types.ObjectId,
    ref:"User"
},
}
)


const labModel = mongoose.model('Lab',labSchema)

export default labModel;