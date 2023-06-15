import express from "express";
const router = express.Router();
import * as adminController from "./controller/admin.controller.js";
import * as patientReserve from "../patient/controller/patientReserve.controller.js";
import * as userController from "../controller/user.controller.js";
import * as generalController from "../../general/general.controller.js";
import roomRoutes from "../../room/room.routes.js";
import noteRoutes from "../../notes/notes.routes.js";
import firstAidRoutes from "../../firstAid/firstAid.routes.js";
import categoryRoutes from "../../categories/categories.routes.js";
import productRoutes from "../../products/products.routes.js";

router.post("/getAllUsers", userController.getAllUsers);
router.post("/addUser", userController.signUp);
router.post("/reserve/:oper", patientReserve.reserveOperController);
router.put("/changePass", userController.changePass);
router.put("/updateUser", adminController.updateUser);
router.delete("/deleteUser", adminController.deleteUser);
router.post("/resetPassword", adminController.resetPassword);
router.post("/addGeneral", generalController.addGeneral);
router.use("/room", roomRoutes);
router.use("/note", noteRoutes);
router.use("/firstAid", firstAidRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);

export default router;
