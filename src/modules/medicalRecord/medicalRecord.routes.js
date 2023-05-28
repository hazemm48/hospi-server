import express from "express";
import * as medicalRecordController from "./controller/medicalRecord.controller.js";

const router = express.Router();

router
  .route("/")
  .post(medicalRecordController.addMedicalRecord)
  .delete(medicalRecordController.deleteMedicalRecord)
  .put(medicalRecordController.updateMedicalRecord)

router.post("/get", medicalRecordController.getMedicalRecord);

export default router;
