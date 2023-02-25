import  express  from "express";
const router = express.Router()
import * as patientController from './controller/patient.controller.js'

router.get("/getAll",patientController.getAllPatient)
router.get("/getDisease",patientController.getAllDiseases)
router.put("/updatePatient",patientController.updatePatient)
router.delete("/deletePatient",patientController.deletePatient)

export default router