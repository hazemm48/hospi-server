import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
    age:Number,
    address:String,
    gender:String,
    specaility:String,
    bio:String,
    main:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      }
})

const doctorModel=mongoose.model("DoctorInfo",doctorSchema)

export default doctorModel