import  express  from "express";
const router = express.Router()
import * as adminController from './controller/admin.controller.js'
import * as patientReserve from "../patient/controller/patientReserve.controller.js"
import * as patientController from "../patient/controller/patient.controller.js"
import * as userController from '../controller/user.controller.js'
import * as generalController from '../../general/general.controller.js'
import roomRoutes from "../../room/room.routes.js";
import { fileUpload } from "../../../utils/fileUploader.js";

router.post("/getAllUsers",adminController.getAllUsers)
router.post("/addUser",userController.signUp)
router.post("/uptest",fileUpload("image"),userController.uploadProfilePic)
router.post("/addGeneral",adminController.addGeneral)
router.post("/reserve/:oper",patientReserve.adminRes)
router.put("/changePass",userController.changePass)
router.put("/updateUser",adminController.updateUser)
router.post("/note",adminController.notes)
router.delete("/deleteUser",adminController.deleteUser)
router.post("/addGeneral",generalController.addGeneral)
router.post("/getGeneral",generalController.getGeneral)
router.use("/room", roomRoutes);

export default router