import userModel from "../../../../../database/models/user.model.js";
import generalModel from "../../../../../database/models/general.model.js";
import { addDocToRoom } from "../../../room/controller/room.controller.js";
import fs from "fs";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import catchAsyncError from "../../../middleware/catchAsyncError.js";
import cloudinary from "../../../../utils/cloudinary.js";

const getAllUsers = async (req, res) => {
  let { role, id, email, phone, sort, pageNo, limit, speciality, filter } =
    req.body;

  pageNo <= 0 || !pageNo ? (pageNo = 1) : pageNo * 1;
  limit <= 0 || !limit ? (limit = 0) : limit * 1;
  let skipItems = (pageNo - 1) * limit;
  if (role) {
    if (role == "patient" || role == "doctor") {
      let find = "";
      let lengthCon = "";
      let findFilter = {
        role,
      };
      filter && (findFilter = { ...findFilter, ...filter });
      speciality
        ? ((find = userModel.find({
            ...findFilter,
            "doctorInfo.speciality": speciality,
          })),
          (lengthCon = userModel.countDocuments({
            findFilter,
            "doctorInfo.speciality": speciality,
            function(err, count) {
              return count;
            },
          })))
        : filter?.name
        ? ((find = userModel.find({
            role,
            name: { $regex: filter.name, $options: "i" },
          })),
          (lengthCon = userModel.countDocuments({
            role,
            name: { $regex: filter.name, $options: "i" },
            function(err, count) {
              return count;
            },
          })))
        : ((find = userModel.find(findFilter)),
          (lengthCon = userModel.countDocuments({
            ...findFilter,
            function(err, count) {
              return count;
            },
          })));
      const users = await find
        .skip(skipItems)
        .limit(limit)
        .collation({ locale: "en" })
        .sort(sort);
      const length = await lengthCon;
      res.json({ messgae: `all ${role}s`, users, length });
    } else if (role == "all") {
      const users = await userModel
        .find()
        .skip(skipItems)
        .limit(limit)
        .collation({ locale: "en" })
        .sort(sort);
      res.json({ messgae: "all users", users });
    } else {
      res.json({ messgae: "invalid input" });
    }
  } else if (id) {
    const users = await userModel.findById(id);
    res.json({ messgae: "user found", users });
  } else if (email || phone) {
    console.log(email, phone);
    let query = {};
    email ? (query.email = email) : "";
    phone ? (query.phone = phone) : "";
    console.log(query);
    const users = await userModel.find(query);
    res.json({ messgae: "user found", users });
  } else if (req.userId) {
    const users = await userModel.findById(req.userId);
    res.json({ messgae: "User", users });
  } else {
    res.json({ messgae: "invalid input" });
  }
};

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
  const deleted = await userModel.findByIdAndDelete(id);
  await cloudinary.api.delete_resources_by_prefix(`hospi/users/${id}`);
  await cloudinary.api.delete_folder(`hospi/users/${id}`);
  res.json({ message: "user deleted" });
};

const updateUser = async (req, res) => {
  let all = req.body;
  const updated = await userModel.findByIdAndUpdate(all.id, all.details, {
    new: true,
  });
  if (all.oldRoom) {
    addDocToRoom({
      roomId: all.room,
      docId: added._id,
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

export { getAllUsers, addGeneral, deleteUser, updateUser, resetPassword };
