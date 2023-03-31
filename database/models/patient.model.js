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
  )

export const patientSchema = new mongoose.Schema(
  {
    birthDate:Date,
    address: String,
    city: String,
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
    medicalRecord:[patientMedicalRecord]
  },
  {
    _id:false
  }
);

