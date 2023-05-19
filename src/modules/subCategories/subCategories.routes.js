import express from "express";
import * as subCategoryController from "./controller/subCategories.controller.js";

const subCategoryRouter = express.Router({mergeParams:true});

subCategoryRouter
  .route("/")
  .get(subCategoryController.getAllSubCategories)
  .post(subCategoryController.createSubCategory);
subCategoryRouter
  .route("/:id")
  .get(subCategoryController.getSubCategoryById)
  .put(subCategoryController.updateSubCategory)
  .delete(subCategoryController.deleteSubCategory);

export default subCategoryRouter;
