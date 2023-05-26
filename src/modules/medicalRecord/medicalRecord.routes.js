import express from "express";
import * as medicalRecordController from "./controller/medicalRecord.controller.js";

const router = express.Router();

router
  .route("/")
  .post(medicalRecordController.addMedicalRecord)



export default router;
