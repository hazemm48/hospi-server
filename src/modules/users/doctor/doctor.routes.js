import  express  from "express";
const router = express.Router()
import * as doctorController from './controller/doctor.controller.js'
import * as userController from '../controller/user.controller.js'


router.get("/getDoc",doctorController.getDoctor)
router.put("/updateDoc",doctorController.updateDoctor)
router.put("/addReport",doctorController.addReport)
router.delete("/deleteDoc",doctorController.deleteDoctor)
router.post("/getAllUsers", userController.getAllUsers);


export default router