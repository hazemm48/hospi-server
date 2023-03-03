import mongoose from "mongoose";

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
    main: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
    timestamps: true,
  }
);

const patientModel = mongoose.model("PatientInfo", patientSchema);

export default patientModel;
