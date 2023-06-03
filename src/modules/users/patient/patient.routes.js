import  express  from "express";
const router = express.Router()
import * as patientController from './controller/patient.controller.js'
import * as patientReport from './controller/patientReport.controller.js'
import * as patientReserve from './controller/patientReserve.controller.js'
import * as reservetest from './controller/reservetest.js'
import validation from "../../middleware/validation.js";
import * as validSchema from "../../middleware/user.validation.js"
import { addSchedule } from "../doctor/controller/addSchedule.controller.js";

router.get("/getDoctorList",patientController.getDoctorList)
router.post("/reserve",patientReserve.reserve)
router.post("/reservetest",reservetest.reserve)
router.get("/getReserve",patientReserve.getReserve)
router.put("/cancelReserve",patientReserve.cancelReserve)
router.get("/generateReport",patientReport.presc)
router.post("/addFavDoctors",patientController.addFavDoctors)
router.put("/updatePatient",validation(validSchema.updateUserSchema),patientController.updatePatient)
router.delete("/deletePatient",patientController.deletePatient)

export default router