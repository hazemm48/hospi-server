/* import examinModel from "../../../../database/models/examin.model.js";
import userModel from "../../../../database/models/user.model.js";

const addExamin = async (req, res) => {
  let all = req.body;
  try {
    const check = await examinModel.findOne({ name: all.name });
    if (check) {
      res.json({ message: "Examination already added" });
    } else {
      const addedExamin = await examinModel.insertMany(all);
      res.json({ message: "Added new Examination", addedExamin });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const getExamin = async (req, res) => {
  let all = req.body;
  try {
    if (all.oper == "all") {
      const allExamin = await examinModel.find();
      res.json({ message: "all Examination", allExamin });
    } else if (!all.oper) {
      const examin = await examinModel.find(all);
      res.json({ message: "all Examination", examin });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const updateExamin = async (req, res) => {
  let all = req.body;
  try {
    const updatedExamin = await examinModel.findByIdAndUpdate(all._id, all, {
      new: true,
    });
    res.json({ message: "Updated", updatedExamin });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const deleteExamin = async (req, res) => {
  try {
    const { _id } = req.body;
    const examin = await examinModel.findById(_id);
    const user = await userModel.findById(examin.patientId);
    user.patientInfo.examins.pop(_id);
    user.save();
    const deletedExamin = await examinModel.deleteOne(_id);
    res.json({ message: "Deleted", deletedExamin });
  } catch (error) {
    res.json({ message: "Not Deleted", error });
  }
};

export { addExamin, getExamin, updateExamin, deleteExamin };
 */