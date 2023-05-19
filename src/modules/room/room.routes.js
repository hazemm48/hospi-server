import express from "express";
import * as roomController from "./controller/room.controller.js";

const router = express.Router();

router
  .route("/")
  .post(roomController.addRoom)
  .put(roomController.updateRoom)
  .delete(roomController.deleteRoom);

router.post("/get", roomController.getRoom);

export default router;
