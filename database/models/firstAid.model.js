import mongoose from "mongoose";

const firstAidSchema = new mongoose.Schema({
  title: String,
  description: String,
  link:String,
  files: [
    {
      name: String,
      path: String,
      _id: false,
    },
  ],
});

const firstAidModel = mongoose.model("FirstAid", firstAidSchema);

export default firstAidModel;
