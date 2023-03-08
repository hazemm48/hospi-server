import express from 'express';
import * as examiController from './controller/examinations.controller.js';
const router = express.Router();

router.post("/addexamin",examiController.addExamin)
router.get("/getexamin",examiController.getExamin)
router.put("updateexamin",examiController.updateExamin)
router.delete("deleteexamin",examiController.deleteExamin)




export default router;