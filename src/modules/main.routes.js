import express from "express";
const router = express.Router();
import * as userController from "./users/controller/user.controller.js";
import patientRoutes from "./users/patient/patient.routes.js";
import pharmacyRoutes from "./pharmacy/pharmacy.routes.js";
import doctorRoutes from "./users/doctor/doctor.routes.js";
/* import examin from './examinations/examinations.routes.js'
 */ import adminRoutes from "./users/admin/admin.routes.js";
/* import labRoutes from './lab/lab.routes.js'
 */ import roomRoutes from "./room/room.routes.js";
import validation from "./middleware/validation.js";
import * as validSchema from "./middleware/user.validation.js";
import {
  auth,
  adminAuth,
  emailAuth,
  verifyCodeAuth,
} from "./middleware/auth.js";
import { signIn } from "./users/admin/controller/admin.controller.js";
import { fileUpload } from "../utils/fileUploader.js";
import fileUploadRoutes from "./fileUpload/fileUpload.routes.js";

router.use("/admin", adminAuth, adminRoutes);
router.post("/adminLogin", signIn);
router.use("/patient", auth, patientRoutes);
router.use("/doctor", auth, doctorRoutes);
/* router.use('/lab',auth,labRoutes) */
router.use("/room", roomRoutes);
router.use("/pharmacy", auth, pharmacyRoutes);
router.use("/fileUpload", fileUploadRoutes);
/* router.use('/examin',auth,examin) */

router.post("/uptest", fileUpload("image"), userController.uploadProfilePic);
router.post("/signUp", userController.signUp);
router.get("/verify/:email", emailAuth, userController.verify);
router.post("/forgetPass/", userController.forgetPassword);
router.post("/verifyResetCode/", userController.verifyResetcode);
router.post("/resetPass/", verifyCodeAuth, userController.resetPassword);
router.post("/signIn", userController.signIn);

export default router;
