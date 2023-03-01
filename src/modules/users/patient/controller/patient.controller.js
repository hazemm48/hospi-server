import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";

const getPatient = async (req, res) => {
  try {
    const patient = await userModel.find(req.userId).populate("info");
    res.json({ messgae: "patient info", patient });
  } catch (error) {
    res.json({ messgae: "error", error });
  }
};

const updatePatient = async (req, res) => {
  let all = req.body;
  try {
    const updated = await userModel.findByIdAndUpdate(req.userId, all, {
      new: true,
    });
    res.json({ messgae: "patient updated", updated });
  } catch (error) {
    res.json({ messgae: "error", error });
  }
};

const deletePatient = async (req, res) => {
  try {
    const deleted = await userModel.deleteOne(req.userId);
    res.json({ messgae: "delete patient", deleted });
  } catch (error) {
    res.json({ messgae: "error", error });
  }
};

const getAllDiseases = async (req, res) => {
  try {
    const patientDiseases = await userModel
      .findById(req.userId)
      .select("patientInfo-_id")
      .populate({ path: "info", select: "diseases-_id" });
    const diseases = patientDiseases.patientInfo.diseases;
    res.json({ messgae: "all diseases", diseases });
  } catch (error) {
    res.json({ messgae: "error", error });
  }
};

const reserveDoctor = async (req, res) => {
  let all = req.body;
  all.patientId = req.userId;
  try {
    const reserve = await reserveModel.insertMany(all);
    res.json({ messgae: "reservation success", reserve });
  } catch (error) {
    res.json({ messgae: "error", error });
  }
};

const getReserve = async (req, res) => {
  let all = req.body;
  try {
    if (all.oper == "all") {
      const allReserve = await reserveModel.find({ patientId: req.userId });
      res.json({ messgae: "all resevations", allReserve });
    } else if (all.oper == "one") {
      const reserve = await reserveModel.findById(all._id).populate('patientId');
      if (reserve.patientId._id == req.userId) {
        res.json({ messgae: "reservation found", reserve });
      } else {
        res.json({ messgae: "not authorized" });
      }
    }
  } catch (error) {
    res.json({ messgae: "error", error });
  }
};

export {
  getPatient,
  updatePatient,
  deletePatient,
  getAllDiseases,
  reserveDoctor,
  getReserve,
};
