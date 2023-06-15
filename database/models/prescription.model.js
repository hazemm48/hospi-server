import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    prescription: String,
    note: String,
    link: String,
    files: [
      {
        name: String,
        path: String,
        _id: false,
      },
    ],
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const prescriptionModel = mongoose.model("Prescription", prescriptionSchema);

export default reserveModel;
