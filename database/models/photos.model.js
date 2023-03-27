import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    path:String,
    createdBy:{
      type: mongoose.Types.ObjectId,
      ref: "User",
  },
  totalVote:{
    type:Number,
    default:0
  }
  },
  {
    timestamps: true,
  }
);

const photoModel = mongoose.model("Photo", photoSchema);

export default photoModel;
