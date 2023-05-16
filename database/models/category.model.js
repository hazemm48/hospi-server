import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name:String,
    type:String,
    image: String,
  },
  {
    timestamps: true,
  }
);

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
