import mongoose from "mongoose";

export const doctorSchema = new mongoose.Schema({
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