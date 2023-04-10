import mongoose from "mongoose";
import { doctorSchema } from "./doctor.model.js";
import { patientSchema } from "./patient.model.js";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: [String],
    role: String,
    patientInfo: patientSchema,
    doctorInfo: doctorSchema,
    phone: String,
    resetCode: Number,
    gender: String,
    notes: [{
      type: mongoose.Types.ObjectId,
      ref: "Note",
    }],
    confirmedEmail: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
