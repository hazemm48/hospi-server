import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:[String],
    role:String,
    patientInfo:{
        type: mongoose.Types.ObjectId,
        ref: "PatientInfo",
      },
    doctorInfo:{
        type: mongoose.Types.ObjectId,
        ref: "DoctorInfo",
      },
    phone:String
})

const userModel=mongoose.model("User",userSchema)

export default userModel