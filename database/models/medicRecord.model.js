import mongoose from "mongoose";

const MedicRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    enums: ["diagnose", "lab", "rad", "operation", "medication"],
  },
  name: String,
  date: Date,
  place: String,
  endDate: Date,
  still: Boolean,
  dosage: String,
  doctorName: String,
  chronic: Boolean,
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
});

const medicRecordModel = mongoose.model("MedicRecord", MedicRecordSchema);

export default medicRecordModel;
