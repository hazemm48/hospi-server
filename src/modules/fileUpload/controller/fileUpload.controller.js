import catchAsyncError from "../../middleware/catchAsyncError.js";
import fs from "fs";
import cloudinary from "../../../utils/cloudinary.js";
import userModel from "../../../../database/models/user.model.js";
import { createDir } from "../../middleware/fileUploader.js";
import AppError from "../../../utils/AppError.js";

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

const uploadFiles = async (req, res, next) => {
  console.log(req.files);
  console.log(req.body);
  let all = req.body;
  if (req.files) {
    let user = await userModel.findById(all.id);
    if (user) {
      let dir = createDir(all);
      for (const file of req.files) {
        const { path } = file;
        let upload = await cloudinary.uploader.upload(path, {
          folder: dir,
        });
        user.files.push({
          name: file.originalname,
          path: upload.secure_url,
        });
        fs.unlink(path, () => {});
      }
      await user.save();
      res.json({ message: "done", files: user.files });
    } else {
      next(new AppError("user not found", 404));
    }
  } else {
    next(new AppError("file not found", 404));
  }
};

const removeFiles = catchAsyncError(async (req, res, next) => {
  let { path, id } = req.body;
  let user = await userModel.findById(id);
  if (user) {
    let fileId = `hospi${path.split("hospi").pop()}`.split(".")[0];
    await cloudinary.uploader.destroy(fileId);
    user.files.some((e, i) => {
      if (e.path == path) {
        user.files.splice(i, 1);
      }
    });
    await user.save();
    res.json({ message: "file deleted", files: user.files });
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
