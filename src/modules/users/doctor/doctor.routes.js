import  express  from "express";
const router = express.Router()
import * as doctorController from './controller/doctor.controller.js'
import * as userController from '../controller/user.controller.js'
import * as patientReserve from '../patient/controller/patientReserve.controller.js'
import { getRoom } from "../../room/controller/room.controller.js";
import { getCategories } from "../../categories/controller/categories.controller.js";
import noteRoutes from "../../notes/notes.routes.js";


router.post("/reserve/:oper", patientReserve.reserveOperController);
router.put("/updateDoc",doctorController.updateDoctor)
router.put("/addReport",doctorController.addReport)
router.put("/unavailableDate/add",doctorController.addUnavailableDates)
router.put("/unavailableDate/remove",doctorController.removeUnavailableDates)
router.delete("/deleteDoc",doctorController.deleteDoctor)
router.post("/getAllUsers", userController.getAllUsers);
router.post("/room/get", getRoom);
router.post("/category/get", getCategories);
router.use("/note", noteRoutes);



export default router