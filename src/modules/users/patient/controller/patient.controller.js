import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import catchAsyncError from "../../../middleware/catchAsyncError.js";
import AppError from "../../../../utils/AppError.js";

const updatePatient = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  const updated = await userModel.findByIdAndUpdate(req.userId, all, {
    new: true,
  });
  res.json({ message: "patient updated", updated });
});

const deletePatient = catchAsyncError(async (req, res, next) => {
  const deleted = await userModel.deleteOne(req.userId);
  const reserveDelete = await reserveModel.deleteMany({ patientId: _id });
  res.json({ message: "delete patient", deleted, reserveDelete });
});

const addFavDoctors = catchAsyncError(async (req, res, next) => {
  let { docId } = req.body;
  let doc = await userModel.findById(docId);
  if (doc) {
    let patient = await userModel.findById(req.userId);
    let favDocs = patient.patientInfo.favDoctors;
    let docIndex = favDocs.indexOf(docId);
    if (docIndex < 0) {
      favDocs.push(docId);
    } else {
      favDocs.splice(docIndex, 1);
    }
    await patient.save();
    res.json({ message: "done", users: favDocs });
  } else {
    next(new AppError("user not found"));
  }
});

const getFavDoctors = catchAsyncError(async (req, res, next) => {
  let patient = await userModel
    .findById(req.userId)
    .populate("patientInfo.favDoctors");
  if (patient) {
    let favDocs = patient.patientInfo.favDoctors;
    res.json({ message: "done", users: favDocs, count: favDocs.length });
  } else {
    next(new AppError("user not found"));
  }
});

export {
  updatePatient,
  deletePatient,
  addFavDoctors,
  getFavDoctors,
};
