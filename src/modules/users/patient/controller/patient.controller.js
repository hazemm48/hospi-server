import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import medicRecordModel from "../../../../../database/models/medicRecord.model.js";

const getDoctorList = async (req, res) => {
  const users = await userModel.find({role:"doctor"});
  res.json({ message: "all doctors", users });
};

const updatePatient = async (req, res) => {
  let all = req.body;
  const updated = await userModel.findByIdAndUpdate(req.userId, all, {
    new: true,
  });
  res.json({ message: "patient updated", updated });
};

const deletePatient = async (req, res) => {
  const deleted = await userModel.deleteOne(req.userId);
  const reserveDelete = await reserveModel.deleteMany({ patientId: _id });
  res.json({ message: "delete patient", deleted, reserveDelete });
};

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

const addFavDoctors = async (req, res) => {
  let { _id } = req.body;
  let add = await userModel.findByIdAndUpdate(req.userId, {
    $push: { "patientInfo.favDoctors": _id },
  });
  res.json({ message: "done", add });
};

export {
  getDoctorList,
  updatePatient,
  deletePatient,
  addFavDoctors,
};
