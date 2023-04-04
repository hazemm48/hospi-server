import mongoose from "mongoose";

export const doctorSchema = new mongoose.Schema({
  age:Number,
  speciality:String,
  birthDate:Date,
  city:String,
  bio:String,
  fees:Number,
  schedule:[{
    day:String,
    time:{
      from:String,
      to:String
    },
    appointments:[{
      type: mongoose.Types.ObjectId,
      ref: "Reservation"
    }],
    limit:Number
  }],
  available:{
    type:Boolean,
    default:true
  },
  room:String,
},{
  _id:false
})