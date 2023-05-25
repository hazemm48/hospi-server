import express from "express";
const router = express.Router();
import * as noteController from "./controller/notes.controller.js";

router
  .route("/")
  .post(noteController.addNote)
  .get(noteController.getNote)
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);

  export default router
