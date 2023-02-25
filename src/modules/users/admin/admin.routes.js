import  express  from "express";
const router = express.Router()
import * as adminController from './controller/admin.controller.js'

router.get("/",adminController.getAlladmin)
router.post("/",adminController.addadmin)
router.put("/",adminController.updateadmin)
router.delete("/",adminController.deleteadmin)

export default router