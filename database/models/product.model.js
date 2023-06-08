import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
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
    type: {
      type: String,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
    },
    batch: {
      type: Number,
    },
    brand: {
      type: Number,
    },
    images: [String],
    available: {
      type: Boolean,
      default: true,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    categoryType: String,
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
