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
      required: [true, "product category required"],
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "product category required"],
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
