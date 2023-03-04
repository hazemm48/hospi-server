import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
roomNum:Number,
date:Date,
time:String,
patientId:{
    type:mongoose.Types.ObjectId,
    ref:"User"
},
doctorId:{
    type:mongoose.Types.ObjectId,
    ref:"User"
}
},
{
    timestamps:true
}
)

const roomModel = mongoose.model('room',roomSchema);
export default roomModel;