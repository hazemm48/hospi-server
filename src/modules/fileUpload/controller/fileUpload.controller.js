import catchAsyncError from "../../middleware/catchAsyncError.js";
import fs from "fs";
import cloudinary from "../../../utils/cloudinary.js";
import userModel from "../../../../database/models/user.model.js";
import { createDir } from "../../middleware/fileUploader.js";
import AppError from "../../../utils/AppError.js";
import medicRecordModel from "../../../../database/models/medicRecord.model.js";
import reserveModel from "../../../../database/models/reserve.model.js";
import firstAidModel from "../../../../database/models/firstAid.model.js";

const uploadProfilePic = catchAsyncError(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  let all = req.body;
  if (req.file) {
    let user = await userModel.findById(all.id);
    if (user) {
      if (user.image) {
        let imageId = `hospi${user.image.split("hospi").pop()}`.split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      }
      let dir = createDir(all);
      let upload = await cloudinary.uploader.upload(req.file.path, {
        folder: dir,
      });
      user.image = upload.secure_url;
      await user.save();
      fs.unlink(req.file.path, () => {});
      res.json({ message: "done" });
    } else {
      next(new AppError("user not found", 404));
    }
  } else {
    next(new AppError("image not found", 404));
  }
});

const uploadFiles = catchAsyncError(async (req, res, next) => {
  console.log(req.files);
  console.log(req.body, "upload");
  let all = req.body;
  let model = "";
  if (all.fieldName == "medicRecord") {
    model = medicRecordModel.findById(all.recId);
  } else if (all.fieldName == "users") {
    model = userModel.findById(all.id);
  } else if (all.fieldName == "reserves") {
    model = reserveModel.findById(all.id);
  }
  else if (all.fieldName == "firstAid") {
    model = firstAidModel.findById(all.id);
  }
  if (req.files) {
    let data = await model;
    console.log(data);
    if (data) {
      let dir = createDir(all);
      let files = "";
      if (all.fieldName == "reserves") {
        files = data.report.files;
      } else {
        files = data.files;
      }
      for (const file of req.files) {
        const { path } = file;
        let upload = await cloudinary.uploader.upload(path, {
          folder: dir,
        });
        files.push({
          name: file.originalname,
          path: upload.secure_url,
        });
        fs.unlink(path, () => {});
      }
      await data.save();
      res.json({ message: "done", files });
    } else {
      next(new AppError("user not found", 404));
    }
  } else {
    next(new AppError("file not found", 404));
  }
});

const removeFiles = catchAsyncError(async (req, res, next) => {
  let { path, id, fieldName } = req.body;
  let model = "";
  if (fieldName == "medicRecord") {
    model = medicRecordModel.findById(id);
  } else if (fieldName == "users") {
    model = userModel.findById(id);
  } else if (fieldName == "reserves") {
    model = reserveModel.findById(id);
  } else if (fieldName == "firstAid") {
    model = firstAidModel.findById(id);
  }
  let data = await model;
  if (data) {
    let fileId = `hospi${path.split("hospi").pop()}`.split(".")[0];
    await cloudinary.uploader.destroy(fileId);
    let files = "";
    if (fieldName == "reserves") {
      files = data.report.files;
    } else {
      files = data.files;
    }
    files.some((e, i) => {
      if (e.path == path) {
        files.splice(i, 1);
      }
    });
    await data.save();
    res.json({ message: "file deleted", files });
  } else {
    next(new AppError("user not found", 404));
  }
});

const removeProfilePic = catchAsyncError(async (req, res, next) => {
  let { path, id } = req.body;
  let user = await userModel.findById(id);
  if (user) {
    let imageId = `hospi${path.split("hospi").pop()}`.split(".")[0];
    await cloudinary.uploader.destroy(imageId);
    user.image = "";
    await user.save();
    res.json({ message: "image deleted" });
  } else {
    next(new AppError("user not found", 404));
  }
});

export { uploadProfilePic, uploadFiles, removeFiles, removeProfilePic };
