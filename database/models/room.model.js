import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String,
  level: Number,
  type:{
    type:String,
    enums:["consult","operation"]
  },
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
},{
  timestamps:true
});

const roomModel = mongoose.model("Room", roomSchema);
export default roomModel;
