import  express  from "express";
const router = express.Router()
import * as patientController from './controller/patient.controller.js'
import * as patientReport from './controller/patientReport.controller.js'
import * as patientReserve from './controller/patientReserve.controller.js'
import validation from "../../middleware/validation.js";
import * as validSchema from "../../middleware/user.validation.js"

router.get("/getAll",patientController.getPatient)
router.post("/reserve",patientReserve.reserve)
router.get("/getReserve",patientReserve.getReserve)
router.put("/cancelReserve",patientReserve.cancelReserve)
router.post("/addMedicRec",patientController.addMedicalRecord)
router.post("/generateReport",patientReport.presc)
router.get("/getReport",patientReport.getReport)
router.get("/getMedicRec",patientController.getMedicalRecord)
router.get("/getMedicRec",patientController.getMedicalRecord)
router.get("/getFavDoctors",patientController.getFavDoctors)      
router.post("/addFavDoctors",patientController.addFavDoctors)      
router.put("/buyMed",patientController.buyMedicine)
router.put("/updatePatient",validation(validSchema.updateUserSchema),patientController.updatePatient)
router.delete("/deletePatient",patientController.deletePatient)

export default router