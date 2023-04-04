import userModel from "../../../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generalModel from "../../../../../database/models/general.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import moment from "moment";

const getAllUsers = async (req, res) => {
  let { role, id, sort, pageNo, limit } = req.body;
  console.log(req.body);

  pageNo <= 0 || !pageNo ? (pageNo = 1) : pageNo;
  pageNo = pageNo * 1 || 1;
  limit <= 0 || !limit ? (limit = 0) : limit;
  limit = limit * 1 || 0;
  let skipItems = (pageNo - 1) * limit;
  if (role) {
    if (role == "patient" || role == "doctor") {
      const users = await userModel
        .find({ role })
        .skip(skipItems)
        .limit(limit)
        .collation({ locale: "en" })
        .sort(sort);
      let length = await userModel.countDocuments({
        role: role,
        function(err, count) {
          return count;
        },
      });
      res.json({ messgae: `all ${role}s`, users,length });
    } else if (role == "all") {
      const users = await userModel
        .find()
        .skip(skipItems)
        .limit(limit)
        .collation({ locale: "en" })
        .sort(sort);
      res.json({ messgae: "all users", users });
    } else {
      res.json({ messgae: "invalid input" });
    }
  } else if (id) {
    const users = await userModel.findById(id);
    res.json({ messgae: "user found", users });
  } else if (req.userId) {
    const users = await userModel.findById(req.userId);
    res.json({ messgae: "User", users });
  } else {
    res.json({ messgae: "invalid input" });
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
};

const signIn = async (req, res) => {
  let { email, password } = req.body;
  let check = await userModel.findOne({ email });
  if (check) {
    if (check.role == "admin") {
      let matched = bcrypt.compareSync(password, check.password[0]);
      if (matched) {
        let token = jwt.sign(
          {
            userId: check._id,
            name: check.name,
            email: email,
            role: check.role,
            isLoggedIn: true,
          },
          process.env.SECRET_KEY
        );
        res.status(200).json({ message: "ok", token: token, user: check });
      } else {
        res.json({ message: "wrong pssword" });
      }
    }
  } else {
    res.json({ message: "not authorized" });
  }
};

const updateUser = async (req, res) => {
  let all = req.body;
  const updated = await userModel.findByIdAndUpdate(all.id, all.details, {
    new: true,
  });
  if (updated) {
    res.json({ message: "update success", updated });
  } else {
    res.json({ message: "update failed" });
  }
};

export { getAllUsers, addGeneral, deleteUser, signIn, updateUser };
