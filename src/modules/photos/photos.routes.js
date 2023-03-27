import express from "express";
import { fileUpload } from "../../utils/fileUploader.js";
import { addPhoto } from "./controller/photos.controller.js";
const router = express.Router();


router.post('/',fileUpload(),addPhoto)

export default router;
