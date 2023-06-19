import roomModel from "../../../../database/models/room.model.js";
import userModel from "../../../../database/models/user.model.js";
import AppError from "../../../utils/AppError.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const addRoom = catchAsyncError(async (req, res) => {
  let all = req.body;
  const check = await roomModel.findOne({ name: all.name });
  if (check) {
    res.json({ message: "Room already exists" });
  } else {
    const added = await roomModel.insertMany(all);
    res.json({ message: "room added", added });
  }
});

const getRoom = catchAsyncError(async (req, res, next) => {
  let { filter, select, sort, pageNo, limit } = req.body;

  pageNo <= 0 || !pageNo ? (pageNo = 1) : pageNo * 1;
  limit <= 0 || !limit ? (limit = 0) : limit * 1;
  let skipItems = (pageNo - 1) * limit;

  let docLength = await roomModel.countDocuments({
    ...filter,
    function(err, count) {
      return count;
    },
  });
  const room = await roomModel
    .find(filter)
    .select(select)
    .skip(skipItems)
    .limit(limit)
    .collation({ locale: "en" })
    .sort(sort);
  res.json({ message: "all Rooms", room, length: docLength });
});

const updateRoom = catchAsyncError(async (req, res, next) => {
  let { id, name, level, type } = req.body;
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
      { name, level, type },
      { new: true }
    );
    res.json({ message: "room updated", updated });
  }
});

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

const removeDocFromRoom = async (data) => {
  let room = await roomModel.find({ name: data });
  if (room.length > 0) {
    room[0].current.splice(room[0].current.indexOf(data), 1);
    await room.save();
  }
};

const deleteRoom = catchAsyncError(async (req, res, next) => {
  const { room, newRoomId, oldRoomId } = req.body;
  let oldRoom = await roomModel.findById(oldRoomId);
  let newRoom = await roomModel.findById(newRoomId);
  if (oldRoomId == newRoomId) {
    return next(new AppError("new room matches old room"));
  }
  if (oldRoom && newRoom) {
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
    await oldRoom.remove();
    res.json({ message: "deleted" });
  } else {
    next(new AppError("Room Not Found"));
  }
});

export {
  addRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  addDocToRoom,
  removeDocFromRoom,
};
