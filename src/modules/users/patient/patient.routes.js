import  express  from "express";
const router = express.Router()
import * as patientController from './controller/patient.controller.js'
import validation from "../../middleware/validation.js";
import * as validSchema from "../../middleware/user.validation.js"

router.get("/getAll",patientController.getPatient)
router.get("/getDisease",patientController.getAllDiseases)
router.get("/report",patientController.medicReport)
router.get("/getDoctors",patientController.getDoctors)
router.get("/getReserve",patientController.getReserve)
router.post("/reserveDoc",patientController.reserveDoctor)
router.post("reservelab",patientController.reserveLab)
router.get("getreservelab",patientController.getReserveLab)
router.put("/buyMed",patientController.buyMedicine)
router.put("/updatePatient",validation(validSchema.updateUserSchema),patientController.updatePatient)
router.delete("/deletePatient",patientController.deletePatient)

export default router