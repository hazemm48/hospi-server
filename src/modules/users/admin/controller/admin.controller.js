import userModel from "../../../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import generalModel from "../../../../../database/models/general.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import { asyncHandler } from "../../../../services/asyncHandler.js";

const getAllUsers =asyncHandler( async (req, res) => {
  let { role } = req.body;
  if (role) {
    const users = await userModel.find({ role });
    res.json({ message: `all ${role}s`, length: users.length, users });
  } else if(req.userId){
    const users = await userModel.findById(req.userId);
    res.json({ messgae: "user", length: users.length, users });
  }else{
    const users = await userModel.find();
    res.json({ message: "all users", length: users.length, users });
  }
});

const addUser =asyncHandler( async (req, res) => {
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
});

const addGeneral =asyncHandler( async (req, res) => {
  let all = req.body;
  try {
    let added = await generalModel.insertMany(all);
    res.json({ message: "added", added });
  } catch (error) {
    res.json({ message: "error", error });
  }
});

const deleteUser =asyncHandler( async (req, res) => {
  let { _id } = req.body;
  try {
    let user = await userModel.findById(_id);
    let role = user.role;
    const deleted = await userModel.findByIdAndDelete(_id);
    if (role == "doctor") {
      const infoDelete = await doctorModel.deleteOne({ main: _id });
      res.json({ message: "doctor deleted", deleted, infoDelete });
    } else if (role == "patient") {
      const infoDelete = await patientModel.deleteOne({ main: _id });
      const reserveDelete = await reserveModel.deleteMany({ patientId: _id });
      res.json({
        message: "patient deleted",
        deleted,
        infoDelete,
        reserveDelete,
      });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
});

const signIn =asyncHandler( async (req, res) => {
  let { email, password } = req.body;
  let check = await userModel.findOne({email});
  if (check) {
    if (check.role == "admin") {
      let matched = bcrypt.compareSync(password, check.password[0]);
      if (matched) {
        let token = jwt.sign(
          {
            userId: check._id,
            name: check.name,
            email: email,
            role:check.role,
            isLoggedIn: true,
          },
          process.env.SECRET_KEY
        );
        res.status(200).json({ message: "ok", token: token, user: check });
      } else {
        res.json({ message: "wrong password" });
      }
    }
  } else {
    res.json({ message: "not authorized" });
  }
});

export { getAllUsers, addUser, addGeneral, deleteUser, signIn };
