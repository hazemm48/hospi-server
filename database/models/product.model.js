import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    priceAfterDiscount: {
      type: Number,
    },
    description: {
      type: String,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [String],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
