 import examinModel from "../../../../database/models/examin.model.js";
import userModel from "../../../../database/models/user.model.js";
import asyncHandler from "../../../services/asyncHandler.js";
import reserveModel from "../../../../database/models/reserve.model.js";
import generalModel from "../../../../database/models/general.model.js";

const addExamin =asyncHandler( async (req, res,next) => {
  let all = req.body;
 
    const check = await generalModel.findOne({ name: all.name });
    if (check) {
      res.status(200).json({ message: "Examination already added" });
    } else {
      const addedExamin = await generalModel.insertMany(all);
      res.status(201).json({ message: "Added new Examination", addedExamin });
    }
  
});

const getExamin =asyncHandler( async (req, res,next) => {
  let all = req.body;
    if (all.oper == "all") {
      const allExamin = await generalModel.find();
      res.status(200).json({ message: "all Examination", allExamin });
    } else if (!all.oper) {
      const examin = await generalModel.find(all);
      res.status(200).json({ message: "all Examination", examin });
    }
 
});

const updateExamin =asyncHandler( async (req, res,next) => {
  let all = req.body;
  
    const updatedExamin = await generalModel.findByIdAndUpdate(all._id, all, {
      new: true,
    });
    res.status(200).json({ message: "Updated", updatedExamin });
 
});

const deleteExamin =asyncHandler( async (req, res,next) => {
  
    const { _id } = req.body;
    const examin = await generalModel.findById(_id);
    const user = await userModel.findById(examin.patientId);
    user.patientInfo.examins.pop(_id);
    user.save();
    const deletedExamin = await generalModel.deleteOne(_id);
    res.status(200).json({ message: "Deleted", deletedExamin });});


const reserveExamin = asyncHandler( async(req,res,next) =>{
  const {date,phone,type} = req.body
  const reserveExamin = await reserveModel.findOne({date})
  if(reserveExamin.length){
    res.status(400).json({message:"The Date is already Reserved"})
  }else{
    const reserved = await reserveModel.insertMany({date,phone,type})
    res.status(201).json({message:"Reserved Done",reserved})
  }
});

const cancelReservation = asyncHandler(async(req,res,next) =>{
  const {patientId} = req.params
  const cancelation = await reserveModel.findByIdAndDelete({patientId})
  if (!cancelation) {
     res.status(404).json({ message: "Reservation not found" });
  }else{
    res.status(200).json({ message: 'Cancelation deleted successfully' });
  }
});

export { addExamin, getExamin, updateExamin, deleteExamin , reserveExamin,cancelReservation};
 