import mongoose from "mongoose";

const MedicRecordSchema = new mongoose.Schema({
  type: String,
  name: String,
  date: Date,
  place: String,
  endDate: Date,
  still: Boolean,
  Dosage: String,
  doctorName: String,
  chronic: Boolean,
  result: [String],
  document: [String],
});

const medicRecordModel = mongoose.model("MedicRecord", MedicRecordSchema);

export default medicRecordModel;
