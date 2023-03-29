import roomModel from "../../../../database/models/room.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

const addRoom =asyncHandler( async (req, res) => {
    let all = req.body;

      const check = await roomModel.findOne({ name: all.name });
      if (check) {
        res.json({ message: "Room already added" });
      } else {
        const added = await roomModel.insertMany(all);
        res.json({ message: "Added new Room", added });
      }

  });

  const getRoom =asyncHandler( async (req, res) => {
    all = req.body;
    
      if (all.oper == "all") {
        const allRoom = await roomModel.find();
        res.json({ message: "all Rooms", allRoom });
      } else if (!all.oper) {
        const room = await roomModel.find(all);
        res.json({ message: "all Rooms", room });
      }
   
  });

  const updateRoom =asyncHandler( async (req, res) => {
    let all = req.body;
    
      const updated = await labModel.findByIdAndUpdate(all._id, all, {
        new: true,
      });
      res.json({ message: "Updated", updated });
   
  });

  const deleteRoom =asyncHandler( async (req, res) => {
    
      const { _id } = req.body;
      const deleted = await roomModel.deleteOne(_id);
      res.json({ message: "Deleted", deleted });
   
  });  



export {
    addRoom,
    getRoom,
    updateRoom,
    deleteRoom
}  