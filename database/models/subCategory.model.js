import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name:String,
    type:String,
    image:String,
    fees:Number,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

export default subCategoryModel;
