import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
    age:Number,
    address:String,
    gender:String,
    specaility:String,
    bio:String,
    fees:Number,
    available:Boolean,
    room:Number,
    appointment:[String],
    main:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      }
},{
    timestamps:true
})

const doctorModel=mongoose.model("DoctorInfo",doctorSchema)

export default doctorModel