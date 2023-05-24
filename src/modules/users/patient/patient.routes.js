import  express  from "express";
const router = express.Router()
import * as patientController from './controller/patient.controller.js'
import * as patientReport from './controller/patientReport.controller.js'
import * as patientReserve from './controller/patientReserve.controller.js'
import * as reservetest from './controller/reservetest.js'
import validation from "../../middleware/validation.js";
import * as validSchema from "../../middleware/user.validation.js"
import { addSchedule, test } from "../doctor/controller/addSchedule.controller.js";

router.get("/getDoctorList",patientController.getDoctorList)
router.post("/reserve",patientReserve.reserve)
router.post("/reservetest",reservetest.reserve)
router.post("/addSchedule",addSchedule)
router.post("/test",test)
router.get("/getReserve",patientReserve.getReserve)
router.put("/cancelReserve",patientReserve.cancelReserve)
router.post("/addMedicRec",patientController.addMedicalRecord)
router.get("/generateReport",patientReport.presc)
router.get("/getReport",patientReport.getReport)
router.get("/getMedicRec",patientController.getMedicalRecord)
router.get("/getMedicRec",patientController.getMedicalRecord)
router.get("/getFavDoctors",patientController.getFavDoctors)      
router.post("/addFavDoctors",patientController.addFavDoctors)      
router.put("/buyMed",patientController.buyMedicine)
router.put("/updatePatient",validation(validSchema.updateUserSchema),patientController.updatePatient)
router.delete("/deletePatient",patientController.deletePatient)

export default router