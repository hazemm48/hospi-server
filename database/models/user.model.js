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
    image:"String",
    notes: [{
      type: mongoose.Types.ObjectId,
      ref: "Note",
    }],
    confirmedEmail: {
      type: Boolean,
      default: true,
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

userSchema.post('init',(doc)=>{
  doc.image = `${process.env.SERVER_URL}/uploads/profilePic/${doc._id}/`+doc.image
  doc.imgPath = `uploads/profilePic/${doc._id}/`+doc.image
})

const userModel = mongoose.model("User", userSchema);

export default userModel;
