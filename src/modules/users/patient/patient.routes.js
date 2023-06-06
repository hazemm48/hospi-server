import  express  from "express";
const router = express.Router()
import * as userController from '../controller/user.controller.js'
import * as patientController from './controller/patient.controller.js'
import * as patientReport from './controller/patientReport.controller.js'
import * as patientReserve from './controller/patientReserve.controller.js'
import validation from "../../middleware/validation.js";
import * as validSchema from "../../middleware/user.validation.js"

router.post("/reserve/:oper", patientReserve.reserveOperController);
router.get("/getReserve",patientReserve.getReserve)
router.put("/cancelReserve",patientReserve.cancelReserve)
router.get("/generateReport",patientReport.presc)
router.post("/favDoctors",patientController.addFavDoctors)
router.post("/favDoctors/get",patientController.getFavDoctors)
router.put("/updatePatient",validation(validSchema.updateUserSchema),patientController.updatePatient)
router.delete("/deletePatient",patientController.deletePatient)
router.post("/getAllUsers", userController.getAllUsers);


export default router