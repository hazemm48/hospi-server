import reserveModel from "../../../../../database/models/reserve.model.js";
import userModel from "../../../../../database/models/user.model.js";
import { asyncHandler } from "../../../../services/asyncHandler.js";

const getDoctor = asyncHandler( async (req, res) => {
  let all = req.body;
  
    if (!all) {
      let doctor = await userModel.find(req.userId);
      res.json({ message: "doctor info", doctor });
    } else if (all.oper == "all") {
      let doctors = await userModel.find({ role: "doctor" });
      res.json({ message: "all doctors", doctors });
    }
  
});

const updateDoctor = asyncHandler( async (req, res) => {
  let all = req.body;
  
    const updated = await userModel.findByIdAndUpdate(req.userId, all, {
      new: true,
    });
    res.json({ message: "doctor updated", updated });
 
});

const deleteDoctor = asyncHandler( async (req, res) => {
 
    const deleted = await userModel.deleteOne(req.userId);
    res.json({ message: "delete doctor", deleted, infoDelete });

});

const addReport = asyncHandler( async (req, res) => {
 
  let all = req.body;
  let add = await reserveModel.findByIdAndUpdate(all.resId,{report:all},{new:true})
  res.json({ message: "report added", add });

});






export { getDoctor, updateDoctor, deleteDoctor, addReport };

