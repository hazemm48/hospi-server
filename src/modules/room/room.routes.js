import express from 'express';
import * as roomController from './controller/room.controller.js'

const router = express.Router();

router.post("/addRoom",roomController.addRoom)
router.get("/getRoom",roomController.getRoom)
router.put("/updateRoom",roomController.updateRoom)
router.delete("deleteRoom",roomController.deleteRoom)
router.post("/reserveRoom",roomController.reserveRoom)





export default router;