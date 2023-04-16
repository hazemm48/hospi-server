import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import { asyncHandler } from "../../../../services/asyncHandler.js";
import medicineModel from "../../../../../database/models/medicine.model.js";

const getPatient = asyncHandler( async (req, res) => {
  const patient = await userModel.findById(req.userId);
  res.status(200).json({ message: "patient info", patient });
});

const updatePatient =asyncHandler( async (req, res) => {
  let all = req.body;
  const updated = await userModel.findByIdAndUpdate(req.userId, all, {
    new: true,
  });
  res.status(200).json({ message: "patient updated", updated });
});

const deletePatient =asyncHandler( async (req, res) => {
  const deleted = await userModel.deleteOne(req.userId);
  const reserveDelete = await reserveModel.deleteMany({ patientId: _id });
  res.status(200).json({ message: "delete patient", deleted, reserveDelete });
});

const addMedicalRecord =asyncHandler( async (req, res) => {
  let all = req.body;
  let patient = await userModel.findById(req.userId);
  let add = patient.patientInfo.medicalRecord.push(all);
  patient.save();
  res.status(201).json({ message: "medical Record added", add });
});

const getMedicalRecord =asyncHandler( async (req, res) => {
  let all = req.body;
  const patient = await userModel.findById(req.userId);
  const medicRec = patient.patientInfo.medicalRecord;
  let condition = (con) => {
    return medicRec.filter((e) => {
      return e.type == con;
    });
  };
  if (all.oper == "all") {
    res.json({ message: "all medical record", medicRec });
  } else if (
    ["medicCond", "lab", "rad", "surgery", "medicine"].includes(all.oper)
  ) {
    let reserve = condition(all.oper);
    res.json({ message: `all ${all.oper}s`, reserve });
  } else {
    res.json({ message: "invalid input" });
  }
});

/*const medicReport = async (req, res) => {
  let report = {};
  let patient = await userModel.findById(req.userId);
  let diseases = patient.patientInfo.diseases;
  report.chronic = diseases.chronic;
  report.diseases = diseases.diseases;
  let lastReserve = await reserveModel
    .find({ patientId: req.userId })
    .sort({ createdAt: -1 })
    .limit(2);
  let lastReserveDate = lastReserve[0].date.getTime();
  let current = new Date(Date.now()).getTime();
  if (lastReserveDate >= current) {
    report.nextVisit = lastReserve[0].date.toLocaleDateString();
    report.lastVisit = lastReserve[1].date.toLocaleDateString();
  } else {
    report.nextVisit = "no coming reservation";
    report.lastVisit = lastReserve[0].date.toLocaleDateString();
  }
  res.json({ message: "report", report });
}; */

const buyMedicine =asyncHandler( async (req, res) => {
  let all = req.body;
  let addMed = await userModel.findByIdAndUpdate(req.userId, {
    $push: { "patientInfo.pharmMedicines": all.medicine },
  });
  res.status(200).json({ message: "medicine added", addMed });
});

//get Medicines from pharmacy 
const getMedicine =asyncHandler( async (req, res,next) => {
  
  const allMed = await medicineModel.find({});
  res.status(200).json({ message: "all Medicines", allMed });
});


const addFavDoctors =asyncHandler( async (req, res) => {
  let { _id } = req.body;
  let add = await userModel.findByIdAndUpdate(req.userId, {
    $push: { "patientInfo.favDoctors": _id },
  });
  res.status(200).json({ message: "done", add });
});


const getFavDoctors =asyncHandler( async (req, res) => {
  let user = await userModel.findById(req.userId);
  let doctorsList = user.patientInfo.favDoctors.map(async (doctor) => {
    let doctorInfo = await userModel.findById(doctor);
    return doctorInfo;
  });
  res.status(200).json({ message: "done", doctorsList });
});


export {
  getPatient,
  updatePatient,
  addMedicalRecord,
  deletePatient,
  getMedicalRecord,
  buyMedicine,
  getMedicine,
  getFavDoctors,
  addFavDoctors,
};
