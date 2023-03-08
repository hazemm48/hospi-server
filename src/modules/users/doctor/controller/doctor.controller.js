<<<<<<< Updated upstream
=======
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



export { getDoctor, updateDoctor, deleteDoctor };
>>>>>>> Stashed changes
