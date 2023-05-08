import generalModel from "../../../database/models/general.model.js";
import AppError from "../../utils/AppError.js";
import catchAsyncError from "../middleware/catchAsyncError.js";

const addGeneral = catchAsyncError(async (req, res, next) => {
  let body = req.body;
  const add = await generalModel.insertMany({body});
  res.status(201).json({ message: "Information Added Successfully",add});
});

const getGeneral = catchAsyncError(async (req, res, next) => {
  let body = req.body;
  const data = await generalModel.find().select(`${body.filter} -_id`);
  res.status(201).json({ message: "Done",data});
});

export {addGeneral,getGeneral}