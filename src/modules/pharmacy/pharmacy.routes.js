import  express  from "express";
import * as medicineController from './controller/pharmacy.controller.js'
const router = express.Router()

router.post("/addMed",medicineController.addMedicine)
router.get("/getMed",medicineController.getMedicine)
router.put("/updateMed/:id",medicineController.updateMedicine)
router.delete("/deleteMed",medicineController.deleteMedicine)


export default router