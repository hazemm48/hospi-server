 import express from 'express';
import * as labController from './controller/lab.controller.js'
const router = express.Router();

router.post("/addLab",labController.addLab)
router.get("/getLab",labController.getLab)
router.put("/updateLab",labController.updateLab)
router.delete("/deleteLab",labController.deleteLab)
router.post("/reserveLab",labController.reserveLab)
router.delete("/cancelLabReservation",labController.cancelReservationLab)




export default router; 