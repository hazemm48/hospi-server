import categoryModel from "../../../../database/models/category.model.js";
import AppError from "../../../utils/AppError.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const createCategory = catchAsyncError(async (req, res, next) => {
  let { name, type } = req.body;
  const categories = await categoryModel.find({ name, type });
  if (categories.length > 0) {
    return next(new AppError("category already exist", 404));
  }
  let add = await categoryModel.insertMany({ name, type });
  res.status(201).json({ message: "added", add });
});

const getCategories = catchAsyncError(async (req, res, next) => {
  let { filter } = req.body;
  let results = await categoryModel.find(filter);
  if (results.length > 0) {
    res.json({ message: "done", results });
  } else {
    return next(new AppError("not found", 404));
  }
});
const deleteCategory = catchAsyncError(async (req, res, next) => {
  let { id } = req.body;
  let results = await categoryModel.findByIdAndDelete(id);
  res.json({ message: "deleted", results });
});

export { createCategory, getCategories, deleteCategory };
