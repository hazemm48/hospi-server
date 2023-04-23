 import examinModel from "../../../../database/models/examin.model.js";
import userModel from "../../../../database/models/user.model.js";
import asyncHandler from "../../../services/asyncHandler.js"

const addExamin =asyncHandler( async (req, res,next) => {
  let all = req.body;
 
    const check = await examinModel.findOne({ name: all.name });
    if (check) {
      res.status(200).json({ message: "Examination already added" });
    } else {
      const addedExamin = await examinModel.insertMany(all);
      res.status(201).json({ message: "Added new Examination", addedExamin });
    }
  
});

const getExamin =asyncHandler( async (req, res,next) => {
  let all = req.body;
    if (all.oper == "all") {
      const allExamin = await examinModel.find();
      res.status(200).json({ message: "all Examination", allExamin });
    } else if (!all.oper) {
      const examin = await examinModel.find(all);
      res.status(200).json({ message: "all Examination", examin });
    }
 
});

const updateExamin =asyncHandler( async (req, res,next) => {
  let all = req.body;
  
    const updatedExamin = await examinModel.findByIdAndUpdate(all._id, all, {
      new: true,
    });
    res.status(200).json({ message: "Updated", updatedExamin });
 
});

const deleteExamin =asyncHandler( async (req, res,next) => {
  
    const { _id } = req.body;
    const examin = await examinModel.findById(_id);
    const user = await userModel.findById(examin.patientId);
    user.patientInfo.examins.pop(_id);
    user.save();
    const deletedExamin = await examinModel.deleteOne(_id);
    res.status(200).json({ message: "Deleted", deletedExamin });

});

export { addExamin, getExamin, updateExamin, deleteExamin };
 