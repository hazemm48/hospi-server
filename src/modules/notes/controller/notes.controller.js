import noteModel from "../../../../database/models/notes.model.js";
import userModel from "../../../../database/models/user.model.js";
import AppError from "../../../utils/AppError.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const addNote = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  let { id, content, personal } = req.body;
  let user = await userModel.findById(id).populate("notes");
  if (user) {
    let createdBy = req.email;
    await noteModel.insertMany({ content, personal, createdBy, userId: id });
    res.json({ message: "note added" });
  } else {
    next(new AppError("user not found", 404));
  }
});

const getNote = catchAsyncError(async (req, res, next) => {
  let { filter } = req.query;
  filter.personal ? (filter.personal = true) : (filter.personal = false);
  let notes = await noteModel.find(filter);
  res.json({ message: "all notes", notes });
});

const deleteNote = catchAsyncError(async (req, res, next) => {
  let { id } = req.body;
  await noteModel.findByIdAndDelete(id);
  res.json({ message: "note deleted" });
});

const updateNote = catchAsyncError(async (req, res, next) => {
  let { id, content } = req.body;
  await noteModel.findByIdAndUpdate(id, { content });
  res.json({ message: "note updated" });
});

export { addNote, getNote, deleteNote, updateNote };
