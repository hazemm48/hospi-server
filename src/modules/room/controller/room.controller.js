import roomModel from "../../../../database/models/room.model.js";
import userModel from "../../../../database/models/user.model.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const addRoom = catchAsyncError(async (req, res) => {
  let all = req.body;
  const check = await roomModel.findOne({ name: all.name });
  if (check) {
    res.json({ message: "Room already exists" });
  } else {
    const added = await roomModel.insertMany(all);
    res.json({ message: "Added new Room", added });
  }
});

const getRoom = catchAsyncError(async (req, res) => {
  let { filter, select } = req.body;
  const room = await roomModel.find({ filter }).select(select)
  res.json({ message: "all Rooms", room });
});

const updateRoom = async (req, res) => {
  let { id, name, level } = req.body;
  let allRooms = await roomModel.find();
  let room = await roomModel.findById(id);
  let check = allRooms.some((e) => {
    if (name && !level) {
      return e.name == name && e.level == room.level;
    } else if (level && !name) {
      return e.name == room.name && e.level == level;
    } else {
      return e.name == name && e.level == level;
    }
  });
  if (check) {
    res.json({ message: "Room already exists" });
  } else {
    const updated = await roomModel.findByIdAndUpdate(
      id,
      { name, level },
      { new: true }
    );
    res.json({ message: "Room Updated", updated });
  }
};

const addDocToRoom = async (data) => {
  let { roomId, docId, oldRoomId } = data;
  let room = await roomModel.findById(roomId);
  let check = room.current.some((e) => {
    return e._id.toHexString() == docId;
  });
  if (oldRoomId) {
    let oldRoom = await roomModel.findById(oldRoomId);
    oldRoom.current.some((e, i) => {
      e._id.toHexString() == docId && oldRoom.current.splice(i, 1);
    });
    await oldRoom.save();
  }
  if (!check) {
    room.current.push(docId);
    let found = room.history.some((e) => {
      return e.toHexString() == docId;
    });
    !found && room.history.push(docId);
    await room.save();
  }
};

const deleteRoom = catchAsyncError(async (req, res, next) => {
  const { room, newRoomId, oldRoomId } = req.body;
  let oldRoom = await roomModel.findById(oldRoomId);
  let newRoom = await roomModel.findById(newRoomId);
  let updateDoc = await userModel.updateMany(
    { _id: { $in: oldRoom.current } },
    { "doctorInfo.room": room },
    { multi: true }
  );
  newRoom.current.push(...oldRoom.current);
  newRoom.history.length > 0
    ? oldRoom.current.filter((e) => {
        return newRoom.history.some((d) => {
          return e.toHexString() == d.toHexString();
        })
          ? ""
          : e;
      })
    : newRoom.history.push(...oldRoom.current);
  await newRoom.save();
  await oldRoom.remove()
  res.json({ message: "Deleted", updateDoc });
});

export { addRoom, getRoom, updateRoom, deleteRoom, addDocToRoom };
