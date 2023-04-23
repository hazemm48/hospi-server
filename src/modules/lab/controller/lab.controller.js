import labModel from "../../../../database/models/lab.model.js";
import userModel from "../../../../database/models/user.model.js";
import asyncHandler from "../../../services/asyncHandler.js"

const addLab =asyncHandler( async (req, res) => {
  let all = req.body;
 
    const check = await labModel.findOne({ name: all.name });
    if (check) {
      res.status(200).json({ message: "Lab already added" });
    } else {
      const added = await labModel.insertMany(all);
      res.status(200).json({ message: "Added new Lab", added });
    }

});

const getLab =asyncHandler( async (req, res) => {
  all = req.body;

    if (all.oper == "all") {
      const allLab = await labModel.find();
      res.status(200).json({ message: "all Labs", allLab });
    } else if (!all.oper) {
      const lab = await labModel.find(all);
      res.status(200).json({ message: "Labs found", lab });
    }

});

const updateLab =asyncHandler( async (req, res) => {
  let all = req.body;
  
    const updated = await labModel.findByIdAndUpdate(all._id, all, {
      new: true,
    });
    res.status(200).json({ message: "Updated", updated });

});

const deleteLab =asyncHandler( async (req, res) => {

    const { _id } = req.body;
    const lab = await labModel.findById(_id);
    const user = await userModel.findById(lab.patientId);
    user.patientInfo.labs.pop(_id);
    user.save();
    const deleted = await labModel.deleteOne(_id);
    res.status(200).json({ message: "Deleted", deleted });
 
});

export { addLab, getLab, updateLab, deleteLab };
 