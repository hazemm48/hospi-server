import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  num: Number,
  level: String,
  history: [
    {
      patientId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      doctorId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      date: Date,
    },
  ],
});

const roomModel = mongoose.model("Room", roomSchema);
export default roomModel;
