import photoModel from "../../../../database/models/photos.model.js";
import cloudinary from "../../../utils/cloudinary.js";

export const addPhoto = async (req, res, next) => {
  console.log(req.file);

  if (!req.file) {
    return res.json({ message: "invalid file type" });
  }
  let {secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:"qrCode"});
   let { createdBy } = req.body;
  await photoModel.insertMany({ path: secure_url, createdBy });
  res.json({ message: "done" });
};
