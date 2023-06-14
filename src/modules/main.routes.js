import express from "express";
const router = express.Router();
import * as userController from "./users/controller/user.controller.js";
import patientRoutes from "./users/patient/patient.routes.js";
import doctorRoutes from "./users/doctor/doctor.routes.js";
import fileUploadRoutes from "./fileUpload/fileUpload.routes.js";
import adminRoutes from "./users/admin/admin.routes.js";
import roomRoutes from "./room/room.routes.js";
import medicalRecordRoutes from "./medicalRecord/medicalRecord.routes.js";
import validation from "./middleware/validation.js";
import * as validSchema from "./middleware/user.validation.js";
import {
  auth,
  adminAuth,
  emailAuth,
  verifyCodeAuth,
} from "./middleware/auth.js";
import { getGeneral } from "./general/general.controller.js";

router.use("/admin", adminAuth, adminRoutes);
router.use("/patient", auth, patientRoutes);
router.use("/doctor", auth, doctorRoutes);
router.use("/room", roomRoutes);
router.use("/medicalRecord", medicalRecordRoutes);
router.use("/fileUpload", fileUploadRoutes);

router.post("/signUp", userController.signUp);
router.get("/verify/:email", emailAuth, userController.verify);
router.post("/forgetPass/", userController.forgetPassword);
router.post("/verifyResetCode/", userController.verifyResetcode);
router.post("/resetPass/", verifyCodeAuth, userController.resetPassword);
router.post("/signIn", userController.signIn);
router.post("/getAllUsers", userController.getAllUsers);
router.post("/getGeneral", getGeneral);


export default router;
