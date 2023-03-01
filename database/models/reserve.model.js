import mongoose from "mongoose"

const reserveSchema = new mongoose.Schema({
    speciality:String,
    room:String,
    turnNum:Number,
    date:Date,
    time:String,
    patientId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    doctorId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      }
})

const reserveModel=mongoose.model("Reservation",reserveSchema)

export default reserveModel