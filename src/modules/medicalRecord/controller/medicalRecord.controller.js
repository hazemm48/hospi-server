import medicRecordModel from "../../../../database/models/medicRecord.model.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const addMedicalRecord = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let added = await medicRecordModel.insertMany(all);
  res.json({ message: "added", added });
});

const getMedicalRecord = catchAsyncError(async (req, res, next) => {
  let { filter } = req.body;
  let records = await medicRecordModel.find(filter).sort("-date");
  res.json({ message: "done", records });
});

const deleteMedicalRecord = catchAsyncError(async (req, res, next) => {
  let { id } = req.body;
  let deleted = await medicRecordModel.findByIdAndDelete(id);
  res.json({ message: "deleted", deleted });
});

export { addMedicalRecord, getMedicalRecord, deleteMedicalRecord };
