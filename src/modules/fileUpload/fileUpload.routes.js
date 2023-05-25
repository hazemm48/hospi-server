import express from "express";
import { fileUpload } from "../middleware/fileUploader.js";
const router = express.Router();
import * as filesUpload from "./controller/fileUpload.controller.js";

router.post(
  "/uploadProfilePic",
  fileUpload("image"),
  filesUpload.uploadProfilePic
);
router.post("/uploadFiles", fileUpload("files"), filesUpload.uploadFiles);
router.post("/removeFiles", filesUpload.removeFiles);
router.post("/removeProfilePic", filesUpload.removeProfilePic);

export default router;
