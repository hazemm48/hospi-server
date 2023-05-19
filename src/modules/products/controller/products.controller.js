import productModel from "../../../../database/models/product.model.js";
import slugify from "slugify";
import catchAsyncError from "../../../utils/middleware/catchAsyncError.js";
import AppError from "../../../utils/services/AppError.js";
import { deleteOne } from "../../../utils/handlers/refactor.handler.js";
import ApiFeatures from "../../../utils/handlers/ApiFeatures.js";

const createProduct = catchAsyncError(async (req, res, next) => {
  let body = req.body;
  body.slug = slugify(body.title);
  let results = new productModel(body);
  let added = await results.save();
  res.status(201).json({ message: "added", added });
});

const getAllProducts = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(productModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  let results = await apiFeature.mongQuery;
  res.json({
    message: "Done",
    page: apiFeature.pageNo,
    limit: apiFeature.limit,
    results,
  });
});

const getProductById = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let results = await productModel.findById(id);
  res.json({ message: "Done", results });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let body = req.body;
  if (body.title) {
    body.slug = slugify(body.title);
  }
  let results = await productModel.findByIdAndUpdate(
    id,
    { ...body },
    { new: true }
  );
  results && res.json({ message: "Done", results });
  !results && next(new AppError("Product not found", 404));
});

const deleteProduct = deleteOne(productModel);

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
