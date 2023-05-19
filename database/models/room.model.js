import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String,
  level: Number,
  current: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  history: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const roomModel = mongoose.model("Room", roomSchema);
export default roomModel;
