import  express  from "express";
const router = express.Router()
import * as doctorController from './controller/doctor.controller.js'

router.get("/getDoc",doctorController.getDoctor)
router.put("/updateDoc",doctorController.updateDoctor)
router.put("/addReport",doctorController.addReport)
router.delete("/deleteDoc",doctorController.deleteDoctor)

export default router