import userModel from "../../../../../database/models/user.model.js";
import {
  addDocToRoom,
  removeDocFromRoom,
} from "../../../room/controller/room.controller.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import catchAsyncError from "../../../middleware/catchAsyncError.js";
import cloudinary from "../../../../utils/cloudinary.js";
import medicRecordModel from "../../../../../database/models/medicRecord.model.js";

const deleteUser = catchAsyncError(async (req, res, next) => {
  let { id } = req.body;
  const user = await userModel.findById(id);
  if (user.role == "patient") {
    let record = await medicRecordModel.deleteMany({
      patientId: { $in: id },
    });
  } else if (user.role == "doctor") {
    await removeDocFromRoom(user.doctorInfo.room);
  }
  ["users", "medicRecord"].map(async (e) => {
    await cloudinary.api.delete_resources_by_prefix(
      `hospi/${e}/${id}`,
      (result) => {
        if (!result) {
          cloudinary.api.delete_folder(`hospi/${e}/${id}`, () => {});
        }
      }
    );
  });
  await user.remove();
  res.json({ message: "user deleted" });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  const updated = await userModel.findByIdAndUpdate(all.id, all.details, {
    new: true,
  });
  if (all.oldRoom) {
    await addDocToRoom({
      roomId: all.roomId,
      docId: all.id,
      oldRoomId: all.oldRoom,
    });
  }
  if (updated) {
    res.json({ message: "update success", updated });
  } else {
    res.json({ message: "update failed" });
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  let check = await userModel.findById(req.body.id);
  if (check) {
    let newPass = nanoid(8);
    let newPassword = bcrypt.hashSync(newPass, Number(process.env.ROUNDS));
    check.password= newPassword;
    check.save();
    res.json({ message: `new password is :${newPass}` });
  } else {
    next(new AppError("user not found", 404));
  }
});

export { deleteUser, updateUser, resetPassword };
