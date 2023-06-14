import express from "express";
import * as firstAidController from "./controller/firstAid.controller.js";

const router = express.Router();

router
  .route("/")
  .post(firstAidController.addFirstAid)
  .put(firstAidController.updateFirstAid)
  .delete(firstAidController.deleteFirstAid);
router.post("/get", firstAidController.getFirstAid);
export default router;
