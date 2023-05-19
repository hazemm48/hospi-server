import categoryModel from "../../../../database/models/category.model.js";
import slugify from "slugify";
import catchAsyncError from "../../../utils/middleware/catchAsyncError.js";
import AppError from "../../../utils/services/AppError.js";
import { deleteOne } from "../../../utils/handlers/refactor.handler.js";
import ApiFeatures from "../../../utils/handlers/ApiFeatures.js";

const createCategory = catchAsyncError(async (req, res, next) => {
  let { name } = req.body;
  let results = new categoryModel({ name, slug: slugify(name) });
  let added = await results.save();
  res.status(201).json({ message: "added" , added});
});

const getAllCategories = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(categoryModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields();

  let results = await apiFeature.mongQuery;
  res.json({
    message: "Done",
    page: apiFeature.pageNo,
    limit: apiFeature.limit,
    results,
  });
});

const getCategoryById = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let results = await categoryModel.findById(id);
  res.json({ message: "Done", results });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let { name } = req.body;
  let results = await categoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );
  results && res.json({ message: "Done", results });
  !results && next(new AppError("category not found",404))
});

const deleteCategory = deleteOne(categoryModel);

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
