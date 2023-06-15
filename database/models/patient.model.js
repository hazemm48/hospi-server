import mongoose from "mongoose";

export const patientSchema = new mongoose.Schema(
  {
    birthDate:Date,
    address: String,
    city: String,
    favDoctors:[{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    reservedDoctors:[{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    _id:false
  }
);

