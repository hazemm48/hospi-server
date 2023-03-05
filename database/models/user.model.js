import mongoose from "mongoose"

const patientSchema = new mongoose.Schema(
  {
    age: Number,
    address: String,
    city: String,
    gender: String,
    diseases: { chronic: [String], diseases: [String] },
    confirmedEmail: {
      type: Boolean,
      default: false,
    },
    reservations: {
      type: mongoose.Types.ObjectId,
      ref: "Reservation",
    },
    medicines:{
      type: [mongoose.Types.ObjectId],
      ref: "Pharma",
    }
  },
  {
    _id:false
  }
);

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
  phone:String
},{
  timestamps:true
})

const userModel=mongoose.model("User",userSchema)

export default userModel