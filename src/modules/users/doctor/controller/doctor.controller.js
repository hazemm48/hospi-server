import doctorModel from '../../../../../database/models/doctor.model.js';
import userModel from '../../../../../database/models/user.model.js'

const getDoctor = async (req, res) => {
    try {
      const doctor = await userModel.find(req.userId).populate("doctorInfo");
      res.json({ message: "doctor info", doctor });
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
      const infoDelete = await doctorModel.deleteOne({"main":req.userId})
      res.json({ message: "delete doctor", deleted,infoDelete });
    } catch (error) {
      res.json({ message: "error", error });
    }
  };

  export{
    getDoctor,updateDoctor,deleteDoctor
  }