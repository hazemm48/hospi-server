import roomModel from "../../../../database/models/room.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

const addRoom =asyncHandler( async (req, res,next) => {
    let all = req.body;

      const check = await roomModel.findOne({ name: all.name });
      if (check) {
        res.status(200).json({ message: "Room already added" });
      } else {
        const added = await roomModel.insertMany(all);
        res.status(201).json({ message: "New Room Added", added });
      }

  });

  const getRoom =asyncHandler( async (req, res,next) => {
    all = req.body;
    
      if (all.oper == "all") {
        const allRoom = await roomModel.find();
        res.status(200).json({ message: "all Rooms", allRoom });
      } else if (!all.oper) {
        const room = await roomModel.find(all);
        res.status(200).json({ message: "all Rooms", room });
      }
   
  });

  const updateRoom =asyncHandler( async (req, res,next) => {
    let all = req.body;
    
      const updated = await roomModel.findByIdAndUpdate(all._id, all, {
        new: true,
      });
      res.status(200).json({ message: "Updated", updated });
   
  });

  const deleteRoom =asyncHandler( async (req, res,next) => {
    
      const { _id } = req.body;
      const deleted = await roomModel.deleteOne(_id);
      res.status(200).json({ message: "Room Deleted", deleted });
   
  });  

  const reserveRoom = asyncHandler( async(req,res,next) =>{
    const {date,doctorName,patientName,type} = req.body
    const reservedRoom = await reserveModel.findOne({date})
    if(reservedRoom.length){
      res.status(200).json({message:"The Date is already Reserved"})
    }else{
      const reserved = await reserveModel.insertMany({date,doctorName,patientName,type})
      res.status(201).json({message:"Reserved Done",reserved})
    }
  });



export {
    addRoom,
    getRoom,
    updateRoom,
    deleteRoom,
    reserveRoom
}  