import medicRecordModel from "../../../../database/models/medicRecord.model.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const addMedicalRecord = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let added = await medicRecordModel.insertMany(all);
  res.json({ message: "added", added });
});

const getMedicalRecord = catchAsyncError(async (req, res, next) => {
  let { filter } = req.body;
  let records = await medicRecordModel.find(filter);
  res.json({ message: "done", records });
});

export { addMedicalRecord, getMedicalRecord };
