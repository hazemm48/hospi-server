import medicRecordModel from "../../../../database/models/medicRecord.model.js";
import cloudinary from "../../../utils/cloudinary.js";
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
  let record = await medicRecordModel.findById(id);

  await cloudinary.api.delete_resources_by_prefix(
    `hospi/medicRecord/${record.patientId}/${id}`,
    (result) => {
      if (!result) {
        cloudinary.api.delete_folder(
          `hospi/medicRecord/${record.patientId}/${id}`,
          () => {}
        );
      }
    }
  );

  let deleted = await record.remove();
  res.json({ message: "deleted", deleted });
});

const updateMedicalRecord = catchAsyncError(async (req, res, next) => {
  let { id, data } = req.body;
  let updated = await medicRecordModel.findByIdAndUpdate(id, data);
  res.json({ message: "updated", updated });
});

export {
  addMedicalRecord,
  getMedicalRecord,
  deleteMedicalRecord,
  updateMedicalRecord,
};
