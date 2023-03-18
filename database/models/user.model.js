import mongoose from "mongoose"
import { patientSchema } from "./patient.model.js"

const doctorSchema = new mongoose.Schema({
  age:Number,
  address:String,
  gender:String,
  specaility:String,
  bio:String,
  fees:Number,
  schedule:[{
    day:String,
    time:String,
    patients:[{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    limit:Number
  }],
  available:{
    type:Boolean,
    default:true
  },
  room:{
    type: mongoose.Types.ObjectId,
    ref: "Room",
  },
  appointment:[{
    patID:{
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reserveID:{
      type: mongoose.Types.ObjectId,
      ref: "Reservation",
    }
  }],
},{
  _id:false
})

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:[String],
  role:String,
  patientInfo:patientSchema,
  doctorInfo:doctorSchema,
  phone:String,
  resetCode:Number,
  confirmedEmail: {
    type: Boolean,
    default: false,
  }, 
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
},{
  timestamps:true
})

const userModel=mongoose.model("User",userSchema)

export default userModel