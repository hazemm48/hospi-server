import userModel from "../../../../../database/models/user.model.js";

const getAllPatient = async (req, res) => {
  const patients = await userModel.find({ authType: "Patient" });
  res.json({ messgae: "all patients", patients });
};

/* const updatePatient = async (req, res) => {
  let all = req.body;
  let keyArr = Object.keys(all);
  let schema = Object.keys(userModel.schema.tree);
  let check = schema.map(async (ele) => {
    if (ele === keyArr[1]) {
      let obj = { [ele]: all[`${ele}`] };
      const updated = await userModel.findByIdAndUpdate(all._id, obj, {
        new: true,
      });
      res.json({ messgae: "update patient", updated });
    }
  });
}; */

const updatePatient = async (req, res) => {
  let all = req.body;
  const updated = await userModel.findByIdAndUpdate(req.userId, all, {
    new: true,
  });
  res.json({ messgae: "patient updated", updated });
};

const deletePatient = async (req, res) => {
  let { _id } = req.body;
  const deleted = await userModel.deleteOne({ _id });
  res.json({ messgae: "delete patient", deleted });
};

const getAllDiseases = async (req, res) => {
  let { _id } = req.body;
  const patientDiseases = await userModel.findById(_id).select("diseases -_id");
  res.json({ messgae: "all diseases", patientDiseases });
};

export { getAllPatient, updatePatient, deletePatient, getAllDiseases };
