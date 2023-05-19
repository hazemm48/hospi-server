import express from "express";
import * as productController from "./controller/products.controller.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);
productRouter
  .route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

export default productRouter;
