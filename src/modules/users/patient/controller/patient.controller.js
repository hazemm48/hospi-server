import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import patientModel from "../../../../../database/models/patient.model.js";
import labModel from "../../../../../database/models/lab.model.js";

const getPatient = async (req, res) => {
  try {
    const patient = await userModel.find(req.userId).populate("patientInfo");
    res.json({ message: "patient info", patient });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const updatePatient = async (req, res) => {
  let all = req.body;
  try {
    const updated = await userModel.findByIdAndUpdate(req.userId, all, {
      new: true,
    });
    res.json({ message: "patient updated", updated });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const deletePatient = async (req, res) => {
  try {
    const deleted = await userModel.deleteOne(req.userId);
    const infoDelete = await patientModel.deleteOne({ main: req.userId });
    const reserveDelete = await reserveModel.deleteMany({ patientId: _id });
    res.json({ message: "delete patient", deleted, infoDelete });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const getAllDiseases = async (req, res) => {
  try {
    const patientDiseases = await userModel
      .findById(req.userId)
      .select("patientInfo-_id")
      .populate({ path: "info", select: "diseases-_id" });
    const diseases = patientDiseases.patientInfo.diseases;
    res.json({ message: "all diseases", diseases });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const reserveDoctor = async (req, res) => {
  let all = req.body;
  all.patientId = req.userId;
  try {
    const reserve = await reserveModel.insertMany(all);
    res.json({ message: "reservation success", reserve });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const getReserve = async (req, res) => {
  let all = req.body;
  try {
    if (all.oper == "all") {
      const allReserve = await reserveModel.find({ patientId: req.userId });
      res.json({ message: "all reservations", allReserve });
    } else if (all.oper == "one") {
      const reserve = await reserveModel
        .findById(all._id)
        .populate("patientId");
      if (reserve.patientId._id == req.userId) {
        res.json({ message: "reservation found", reserve });
      } else {
        res.json({ message: "not authorized" });
      }
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};

//reserve lab
const reserveLab = async (req, res) => {
  let all = req.body;
  all.patientId = req.userId;
  try {
    const reservedlab = await labModel.insertMany(all);
    res.json({ message: "reservation success", reservedlab });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

//getReserve Lab

const getReserveLab = async (req, res) => {
  let all = req.body;
  try {
    if (all.oper == "all") {
      const allReservedLab = await labModel.find({ patientId: req.userId });
      res.json({ message: "all reservations", allReservedLab });
    } else if (all.oper == "one") {
      const reserved = await labModel
        .findById(all._id)
        .populate("patientId");
      if (reserveLab.patientId._id == req.userId) {
        res.json({ message: "reservation found", reserved });
      } else {
        res.json({ message: "not authorized" });
      }
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const medicReport = async (req, res) => {
  let report = {};
  try {
    let diseases = await userModel
      .findById(req.userId)
      .select("patientInfo-_id")
      .populate({ path: "patientInfo", select: "diseases-_id" });
    report.chronic = diseases.chronic;
    report.diseases = diseases.patientInfo.diseases;
    let lastReserve = await reserveModel
      .find({ patientId: req.userId })
      .sort({ createdAt: -1 })
      .limit(2);
    let lastReserveDate = lastReserve[0].date.getTime();
    let current = new Date(Date.now()).getTime();
    console.log(lastReserveDate, current);
    if (lastReserveDate >= current) {
      report.nextVisit = lastReserve[0].date.toLocaleDateString();
      report.lastVisit = lastReserve[1].date.toLocaleDateString();
    } else {
      report.nextVisit = "no coming reservation";
      report.lastVisit = lastReserve[0].date.toLocaleDateString();
    }
    res.json({ message: "report", report });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const getDoctors = async (req, res) => {
  try {
    let doctors = await userModel
      .find({ role: "doctor" })
      .populate("doctorInfo");
    res.json({ message: "all doctors", doctors });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const buyMedicine = async (req, res) => {
  try {
    let all = req.body;
    let addMed = await patientModel.findByIdAndUpdate(all._id, {
      $push: { medicines: all.medicine },
    });
    res.json({ message: "medicine added", addMed });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

export {
  getPatient,
  updatePatient,
  deletePatient,
  getAllDiseases,
  reserveDoctor,
  getReserve,
  reserveLab,
  getReserveLab,
  medicReport,
  getDoctors,
  buyMedicine,
};
