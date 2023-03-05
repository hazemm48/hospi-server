import express from 'express';
import * as roomController from './controller/room.controller.js'

const router = express.Router();

router.post("/addroom",roomController.addRoom)
router.get("/getroom",roomController.getRoom)
router.put("/updateroom",roomController.updateRoom)
router.delete("deleteroom",roomController.deleteRoom)





export default router;