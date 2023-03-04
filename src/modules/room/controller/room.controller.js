import roomModel from "../../../../database/models/room.model.js";

const addRoom = async (req, res) => {
    let all = req.body;
    try {
      const check = await roomModel.findOne({ name: all.name });
      if (check) {
        res.json({ message: "Room already added" });
      } else {
        const added = await roomModel.insertMany(all);
        res.json({ message: "Added new Room", added });
      }
    } catch (error) {
      res.json({ message: "error", error });
    }
  };

  const getRoom = async (req, res) => {
    all = req.body;
    try {
      if (all.oper == "all") {
        const allRoom = await roomModel.find();
        res.json({ message: "all Rooms", allRoom });
      } else if (!all.oper) {
        const room = await roomModel.find(all);
        res.json({ message: "all Rooms", room });
      }
    } catch (error) {
      res.json({ message: "error", error });
    }
  };

  const updateRoom = async (req, res) => {
    let all = req.body;
    try {
      const updated = await labModel.findByIdAndUpdate(all._id, all, {
        new: true,
      });
      res.json({ message: "Updated", updated });
    } catch (error) {
      res.json({ message: "error", error });
    }
  };

  const deleteRoom = async (req, res) => {
    try {
      const { _id } = req.body;
      const deleted = await roomModel.deleteOne(_id);
      res.json({ message: "Deleted", deleted });
    } catch (error) {
      res.json({ message: "Not Deleted", error });
    }
  };  



export {
    addRoom,
    getRoom,
    updateRoom,
    deleteRoom
}  