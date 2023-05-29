import express from "express";
const router = express.Router();
import * as adminController from "./controller/admin.controller.js";
import * as patientReserve from "../patient/controller/patientReserve.controller.js";
import * as userController from "../controller/user.controller.js";
import * as generalController from "../../general/general.controller.js";
import * as filesUpload from "../../fileUpload/controller/fileUpload.controller.js";
import roomRoutes from "../../room/room.routes.js";
import noteRoutes from "../../notes/notes.routes.js";
import firstAidRoutes from "../../firstAid/firstAid.routes.js";
import { presc } from "../patient/controller/patientReport.controller.js";

router.post("/getAllUsers", adminController.getAllUsers);
router.post("/addUser", userController.signUp);
router.post("/uptest", filesUpload.uploadProfilePic);
router.post("/addGeneral", adminController.addGeneral);
router.post("/reserve/:oper", patientReserve.adminRes);
router.post("/generatePresc", presc);
router.put("/changePass", userController.changePass);
router.put("/updateUser", adminController.updateUser);
router.delete("/deleteUser", adminController.deleteUser);
router.post("/resetPassword", adminController.resetPassword);
router.post("/addGeneral", generalController.addGeneral);
router.post("/getGeneral", generalController.getGeneral);
router.use("/room", roomRoutes);
router.use("/note", noteRoutes);
router.use("/firstAid", firstAidRoutes);

export default router;
