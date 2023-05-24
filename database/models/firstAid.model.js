import mongoose from "mongoose";

const firstAidSchema = new mongoose.Schema({
  title: String,
  description: String,
  link:String
});

const FirstAidModel = mongoose.model("FirstAid", firstAidSchema);

export default FirstAidModel;
