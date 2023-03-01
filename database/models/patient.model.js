import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
    age:Number,
    address:String,
    city:String,
    gender:String,
    diseases:[String],
    main:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    reservations:{
        type: mongoose.Types.ObjectId,
        ref:"Reservation"
    }  
})

const patientModel=mongoose.model("PatientInfo",patientSchema)

export default patientModel