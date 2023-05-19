import express from "express";
import subCategoryRouter from "../subCategories/subCategories.routes.js";
import * as categoryController from "./controller/categories.controller.js";

const categoryRouter = express.Router();

categoryRouter.use(':id/subCategory',subCategoryRouter)

categoryRouter
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);
categoryRouter
  .route("/:id")
  .get(categoryController.getCategoryById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default categoryRouter;
