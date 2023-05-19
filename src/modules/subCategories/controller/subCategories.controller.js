import subCategoryModel from "../../../../database/models/subCategory.model.js";
import { deleteOne } from "../../../utils/handlers/refactor.handler.js";
import ApiFeatures from "../../../utils/handlers/ApiFeatures.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import AppError from "../../../utils/AppError.js";

const createSubCategory = catchAsyncError(async (req, res, next) => {
  let { name, categoryId } = req.body;
  let results = new subCategoryModel({
    name,
    slug: slugify(name),
    category: categoryId,
  });
  let added = await results.save();
  res.status(201).json({ message: "added", added });
});

const getAllSubCategories = catchAsyncError(async (req, res, next) => {
  let filters = {};
  if (req.params && req.params.id) {
    filters = {
      category: req.params.id,
    };
  }
  let apiFeature = new ApiFeatures(subCategoryModel.find(), req.query)
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

const getSubCategoryById = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let results = await subCategoryModel.findById(id);
  res.json({ message: "Done", results });
});

const updateSubCategory = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let { name, categoryId } = req.body;
  let results = await subCategoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );
  results && res.json({ message: "Done", results });
  !results && next(new AppError("subCategory not found", 404));
});

const deleteSubCategory = deleteOne(subCategoryModel);

export {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  deleteSubCategory,
  updateSubCategory,
};
