import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: String,
    createdBy: String,
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    personal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;
