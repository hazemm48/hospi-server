import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    doctorId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    date:Date
},
{
    timestamps:true
}
)

const roomSchema = new mongoose.Schema({
num:Number,
level:String,
history:[historySchema]
}
)

const roomModel = mongoose.model('room',roomSchema);
export default roomModel;