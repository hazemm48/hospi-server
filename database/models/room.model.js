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
}
)

const roomSchema = new mongoose.Schema({
roomNum:Number,
level:String,
time:String,
history:[historySchema]

},
{
    timestamps:true
}
)

const roomModel = mongoose.model('room',roomSchema);
export default roomModel;