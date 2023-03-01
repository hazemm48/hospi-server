import  express  from "express";
const router = express.Router()
import * as adminController from './controller/admin.controller.js'
import * as patientController from "../patient/controller/patient.controller.js"
import * as userController from '../controller/user.controller.js'
import auth from "../../middleware/auth.js";

router.get("/getAllUsers",auth,adminController.getAllUsers)
router.post("/addUSer",adminController.addUser)
router.post("/addPatient",userController.signUp)

export default router