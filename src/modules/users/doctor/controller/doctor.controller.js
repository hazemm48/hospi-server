import reserveModel from "../../../../../database/models/reserve.model.js";
import surgeryModel from "../../../../../database/models/surgeries.model.js";
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

const addReport = asyncHandler( async (req, res, next) => {
 
  let all = req.body;
  let addedReport = await reserveModel.findByIdAndUpdate(all.resId,{report:all},{new:true})
  res.json({ message: "report added", addedReport });

});
//get Schedule 
const getSchedule = asyncHandler(async (req,res,next) =>{
  let schedule = await reserveModel.find({patientId},patName,date)
  res.json({message:"This is your Schedule",schedule})
});


//add surgery
const addSurgery = asyncHandler(async(req,res,next) =>{
  let {patientName,surgeryName} = req.body
  const checkSurgery = await surgeryModel.findOne({name:patientName});
  if(checkSurgery){
    res.json({message:"Surgery already added"})
  }else{
    const addedSurgery = await surgeryModel.insertMany({patientName,surgeryName})
    res.json({message:"Added surgery",addedSurgery})
  }
});


//getSurgeries
const getSurgery = asyncHandler(async(req,res,next) =>{
 let surgery = await surgeryModel.find(patientName,surgeryName)
 res.json({message:"This is your Surgeries",surgery})
});






export { getDoctor, updateDoctor, deleteDoctor, addReport , getSchedule,addSurgery,getSurgery};

