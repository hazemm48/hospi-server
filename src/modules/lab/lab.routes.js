 import express from 'express';
import * as labController from './controller/lab.controller.js'
const router = express.Router();

router.post("/addlab",labController.addLab)
router.get("/getlab",labController.getLab)
router.put("/updatelab",labController.updateLab)
router.delete("/deletelab",labController.deleteLab)




export default router; 