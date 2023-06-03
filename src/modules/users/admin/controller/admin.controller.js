import userModel from "../../../../../database/models/user.model.js";
import generalModel from "../../../../../database/models/general.model.js";
import { addDocToRoom } from "../../../room/controller/room.controller.js";
import fs from "fs";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import catchAsyncError from "../../../middleware/catchAsyncError.js";
import cloudinary from "../../../../utils/cloudinary.js";
import medicRecordModel from "../../../../../database/models/medicRecord.model.js";

const addGeneral = async (req, res) => {
  let all = req.body;
  try {
    let added = await generalModel.insertMany(all);
    res.json({ message: "added", added });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const deleteUser = async (req, res) => {
  let { id } = req.body;
  const user = await userModel.findById(id);
  if (user.role == "patient") {
    let record = await medicRecordModel.deleteMany({
      patientId: { $in: id },
    });
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
};

const updateUser = async (req, res) => {
  let all = req.body;
  const updated = await userModel.findByIdAndUpdate(all.id, all.details, {
    new: true,
  });
  if (all.oldRoom) {
    addDocToRoom({
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
};

const resetPassword = catchAsyncError(async (req, res, next) => {
  let check = await userModel.findById(req.body.id);
  if (check) {
    let newPass = nanoid(8);
    let newPassword = bcrypt.hashSync(newPass, Number(process.env.ROUNDS));
    check.password[0] = newPassword;
    check.password[1] = newPass;
    check.save();
    res.json({ message: `new password is :${newPass}` });
  } else {
    next(new AppError("user not found", 404));
  }
});

export { addGeneral, deleteUser, updateUser, resetPassword };
