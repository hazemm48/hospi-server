import  express  from "express";
const router = express.Router()
import * as doctorController from './controller/doctor.controller.js'

router.get("/getDoc",doctorController.getDoctor)
router.put("/updateDoc",doctorController.updateDoctor)
router.put("/addReport",doctorController.addReport)
router.delete("/deleteDoc",doctorController.deleteDoctor)
router.get("/getSchedule",doctorController.getSchedule)
router.post("/addSurgery",doctorController.addSurgery)
router.get("/getSurgery",doctorController.getSurgery)
router.delete("/cancelSurgery/:id",doctorController.cancelSurgery)


export default router