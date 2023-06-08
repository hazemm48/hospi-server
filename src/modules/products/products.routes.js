import express from "express";
import * as productController from "./controller/products.controller.js";

const router = express.Router();

router
  .route("/")
  .post(productController.createProduct)
  .put(productController.updateProduct);
router.post("/get", productController.getAllProducts); 

export default router;
