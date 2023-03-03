import  express  from "express";
const router = express.Router()
import * as adminController from './controller/admin.controller.js'
import * as patientController from "../patient/controller/patient.controller.js"
import * as userController from '../controller/user.controller.js'

router.get("/getAllUsers",adminController.getAllUsers)
router.post("/addUser",adminController.addUser)
router.post("/addGeneral",adminController.addGeneral)
router.delete("/deleteUser",adminController.deleteUser)

export default router