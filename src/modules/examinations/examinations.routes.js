import express from 'express';
import * as examinController from './controller/examinations.controller.js';
const router = express.Router();

router.post("/addExamin",examinController.addExamin)
router.get("/getExamin",examinController.getExamin)
router.put("/updateExamin",examinController.updateExamin)
router.delete("/deleteExamin",examinController.deleteExamin)
router.post("/reserveExamin",examinController.reserveExamin)
router.delete("/cancelReservation",examinController.cancelReservation)


export default router; 