import mongoose from "mongoose"

const reserveSchema = new mongoose.Schema({
    specialty:String,
    room:String,
    turnNum:Number,
    date:Date,
    time:String,
    phone:String,
    name:String,
    anotherPerson:Boolean,
    patientId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    doctorId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      }
},{
    timestamps:true
})

const reserveModel=mongoose.model("Reservation",reserveSchema)

export default reserveModel