import mongoose from "mongoose";

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
    medicalRecord:[{
      type: mongoose.Types.ObjectId,
      ref: "MedicRecord",
    }]
  },
  {
    _id:false
  }
);

