import express from "express";
import * as categoryController from "./controller/categories.controller.js";

const router = express.Router();

router
  .route("/")
  .post(categoryController.createCategory)
  .delete(categoryController.deleteCategory);
/*   .put(categoryController.updateCategory)*/

router.post("/get", categoryController.getCategories); 

export default router;
