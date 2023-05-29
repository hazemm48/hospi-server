import firstAidModel from "../../../../database/models/firstAid.model.js";
import AppError from "../../../utils/AppError.js";
import cloudinary from "../../../utils/cloudinary.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const addFirstAid = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  const check = await firstAidModel.findOne({ title: all.title });
  if (check) {
    next(new AppError("first aid already exists"));
  } else {
    const added = await firstAidModel.insertMany(all);
    res.json({ message: "added", added });
  }
});

const updateFirstAid = catchAsyncError(async (req, res, next) => {
  let { id, data } = req.body;
  const aid = await firstAidModel.findById(id);
  if (aid) {
    if (!(data.title == aid.title)) {
      const check = await firstAidModel.findOne({ title: data.title });
      if (check) {
        return next(new AppError("first aid already exists"));
      }
    }
    console.log(data);
    aid.set(data);
    await aid.save();
    res.json({ message: "first aid updated", aid });
  } else {
    next(new AppError("first aid not found"));
  }
});

const getFirstAid = catchAsyncError(async (req, res, next) => {
  let { filter } = req.body;
  const check = await firstAidModel.find(filter);
  console.log(check);
  if (check.length > 0) {
    res.json({ message: "found", aids: check });
  } else {
    next(new AppError("not found" , 404));
  }
});

const deleteFirstAid = catchAsyncError(async (req, res, next) => {
  let { id } = req.body;
  const aid = await firstAidModel.findById(id);
  await cloudinary.api.delete_resources_by_prefix(
    `hospi/firstAid/${id}`,
    (result) => {
      if (!result) {
        cloudinary.api.delete_folder(`hospi/firstAid/${id}`, () => {});
      }
    }
  );
  await aid.remove();
  res.json({ message: "deleted" });
});

export { addFirstAid, getFirstAid, updateFirstAid, deleteFirstAid };
