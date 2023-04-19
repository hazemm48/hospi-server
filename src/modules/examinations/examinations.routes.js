import express from 'express';
import * as examinController from './controller/examinations.controller.js';
const router = express.Router();

router.post("/addexamin",examinController.addExamin)
router.get("/getexamin",examinController.getExamin)
router.put("/updateexamin",examinController.updateExamin)
router.delete("/deleteexamin",examinController.deleteExamin)


export default router; 