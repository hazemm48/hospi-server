import reserveModel from "../../../../../database/models/reserve.model.js";
import userModel from "../../../../../database/models/user.model.js";

const getDoctor = async (req, res) => {
  let all = req.body;
  try {
    if (!all) {
      let doctor = await userModel.find(req.userId);
      res.json({ message: "doctor info", doctor });
    } else if (all.oper == "all") {
      let doctors = await userModel.find({ role: "doctor" });
      res.json({ message: "all doctors", doctors });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const updateDoctor = async (req, res) => {
  let all = req.body;
  try {
    const updated = await userModel.findByIdAndUpdate(req.userId, all, {
      new: true,
    });
    res.json({ message: "doctor updated", updated });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const deleted = await userModel.deleteOne(req.userId);
    res.json({ message: "delete doctor", deleted, infoDelete });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const addReport = async (req, res) => {
  try {
    let all = req.body;
  let add = await reserveModel.findByIdAndUpdate(all.resId,{report:all},{new:true})
  res.json({ message: "report added", add });
  } catch (error) {
    res.json({message:"Error",error})
  }
};

//get Schedule for Doc 
const getSchedule = async (req, res) => {
 let all = req.params;
  try {
    if (all.oper == "all") {
      const allSchedules = await reserveModel.find();
      res.json({ message: "Some Schedule", allSchedules });
    } else if (!all.oper) {
      const schedule = await reserveModel.find(all);
      res.json({ message: "all Schedules found", schedule });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};



export { getDoctor, updateDoctor, deleteDoctor, addReport,getSchedule };
