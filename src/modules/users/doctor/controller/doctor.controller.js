import reserveModel from "../../../../../database/models/reserve.model.js";
import userModel from "../../../../../database/models/user.model.js";
import AppError from "../../../../utils/AppError.js";
import catchAsyncError from "../../../middleware/catchAsyncError.js";

const updateDoctor = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  try {
    const updated = await userModel.findByIdAndUpdate(req.userId, all, {
      new: true,
    });
    res.json({ message: "doctor updated", updated });
  } catch (error) {
    res.json({ message: "error", error });
  }
});

const deleteDoctor = catchAsyncError(async (req, res) => {
  try {
    const deleted = await userModel.deleteOne(req.userId);
    res.json({ message: "delete doctor", deleted, infoDelete });
  } catch (error) {
    res.json({ message: "error", error });
  }
});

const addReport = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let add = await reserveModel.findByIdAndUpdate(
    all.resId,
    {
      $set: {
        "report.prescription": all.prescription,
        "report.note": all.note,
      },
    },
    { new: true }
  );
  res.json({ message: "added", add });
});

const addUnavailableDates = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let add = await userModel.findByIdAndUpdate(
    all.id,
    {
      $addToSet: {
        "doctorInfo.unavailableDates": all.date,
      },
    },
    { new: true }
  );
  res.json({ message: "added", add });
});

const removeUnavailableDates = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let add = await userModel.findByIdAndUpdate(
    all.id,
    {
      $pull: {
        "doctorInfo.unavailableDates": all.date,
      },
    },
    { new: true }
  );
  res.json({ message: "added", add });
});

export {
  updateDoctor,
  deleteDoctor,
  addReport,
  addUnavailableDates,
  removeUnavailableDates,
};
