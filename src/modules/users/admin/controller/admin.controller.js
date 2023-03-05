import userModel from "../../../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import generalModel from "../../../../../database/models/general.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";

const getAllUsers = async (req, res) => {
    let { role } = req.body;
    if (role) {
      const users = await userModel.find({ role });
      res.json({ messgae: `all ${role}s`, length: users.length, users });
    } else {
      const users = await userModel.find();
      res.json({ messgae: "all users", length: users.length, users });
    }
};

const addUser = async (req, res) => {
  let all = req.body;
    try {
      let add = async (check) => {
        if (check) {
          res.json({ message: "already registered" });
        } else {
          let hashedPass = bcrypt.hashSync(
            all.password,
            Number(process.env.ROUNDS)
          );
          all.password = [hashedPass, all.password];
          let added = await userModel.insertMany(all);
          all.main = added[0]._id.toHexString();
          res.json({ message: "user added", added });
        }
      };
      if (all.phone) {
        let check = await userModel.findOne({ phone: all.phone });
        add(check);
      } else if (all.email) {
        let check = await userModel.findOne({ email: all.email });
        add(check);
      }
    } catch (error) {
      res.json({ message: "error", error });
    }
};

const addGeneral = async (req, res) => {
  let all = req.body;
  try {
    let added = await generalModel.insertMany(all);
    res.json({ message: "added", added });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const deleteUser = async (req, res) => {
  let {_id}=req.body
  try {
    let user = await userModel.findById(_id)
    let role=user.role
    const deleted = await userModel.findByIdAndDelete(_id);
    if(role=="doctor"){
      const infoDelete = await doctorModel.deleteOne({"main":_id})
      res.json({ message: "doctor deleted", deleted,infoDelete });
    }else if (role=="patient"){
      const infoDelete = await patientModel.deleteOne({"main":_id})
      const reserveDelete = await reserveModel.deleteMany({"patientId":_id})
      res.json({ message: "patient deleted", deleted,infoDelete,reserveDelete });
    } 
  } catch (error) {
    res.json({ message: "error", error });
  }
};


export { getAllUsers, addUser, addGeneral, deleteUser };
