import express from "express";
import { fileUpload } from "../../utils/fileUploader.js";
const router = express.Router();
import * as fileUploadController from './controller/fileUpload.controller.js'

router.put("/",fileUpload("image"), fileUploadController.putFile);
router.get("/:name", fileUploadController.getFile);
router.delete("/", fileUploadController.deleteFile);


export default router
