import  express  from "express";
const router = express.Router()
import * as doctorController from './controller/doctor.controller.js'

router.get("/",doctorController.getAlldoctor)
router.post("/",doctorController.adddoctor)
router.put("/",doctorController.updatedoctor)
router.delete("/",doctorController.deletedoctor)

export default router