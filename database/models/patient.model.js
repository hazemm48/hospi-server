import mongoose from "mongoose";


const patientMedicalRecord = new mongoose.Schema({
  type:String,  
  name:String,
  date:Date,
  place:String,
  result:[String],
  document:[String],
  endDate:Date,
  still:Boolean,
  Dosage:String,
  doctorName:String,
  chronic:Boolean,
  },
  {
    _id:false
  })

export const patientSchema = new mongoose.Schema(
  {
    age: Number,
    address: String,
    city: String,
    gender: String,
    reservations: [{
      type: mongoose.Types.ObjectId,
      ref: "Reservation",
    }],
    pharmMedicines:[{
      type: mongoose.Types.ObjectId,
      ref: "Pharma",
    }],
    favDoctors:[{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    Reports:[{
      type: mongoose.Types.ObjectId,
      ref: "Report",
    }],
    medicalRecord:[patientMedicalRecord]
  },
  {
    _id:false
  }
);

