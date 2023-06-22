import userModel from "../../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMAil } from "../../../services/sendMail.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import AppError from "../../../utils/AppError.js";
import { addDocToRoom } from "../../room/controller/room.controller.js";
import mongoose from "mongoose";
import moment from "moment";

const signUp = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let check = await userModel.findOne({ email: all.email });
  if (check) {
    next(new AppError("already registered", 404));
  } else {
    let hashedPass = bcrypt.hashSync(all.password, Number(process.env.ROUNDS));
    all.password =hashedPass;
    if (all.role == "patient") {
      if (req.role == "admin") {
        all.confirmedEmail = true;
      } else {
        sendMAil({ email: all.email, operation: "verify" });
      }
      let added = await userModel.insertMany(all);
      res.status(200).json({ message: "patient added", added });
    } else if (all.role == "doctor" && req.role == "admin") {
      all.confirmedEmail = true;
      let added = await userModel.insertMany(all);
      await addDocToRoom({ roomId: all.roomId, docId: added[0]._id });
      res.json({ message: "doctor added", added });
    } else if (all.role == "admin" && req.email == process.env.ADMIN) {
      all.confirmedEmail = true;
      let added = await userModel.insertMany(all);
      res.json({ message: "admin added", added });
    } else {
      next(new AppError("unauthorized", 401));
    }
  }
});

const signIn = catchAsyncError(async (req, res, next) => {
  let { email, password, rememberMe } = req.body;
  let check = await userModel.findOne({ email });
  if (check) {
    let matched = bcrypt.compareSync(password, check.password);
    if (matched) {
      if (check.confirmedEmail == true) {
        let token = "";
        let expiry = false;
        let tokenConfig = {
          userId: check._id,
          name: check.name,
          email: email,
          role: check.role,
          isLoggedIn: true,
        };
        if (rememberMe == true) {
          token = jwt.sign(tokenConfig, process.env.SECRET_KEY);
        } else {
          token = jwt.sign(tokenConfig, process.env.SECRET_KEY, {
            expiresIn: "2d",
          });
          expiry = moment().add(2, "d").format("YYYY-MM-DD HH:mm");
        }
        check.isLoggedIn = true;
        delete check.password;
        check.save();
        res.json({
          message: "welcome",
          token,
          expiry,
          role: check.role,
          user: check,
        });
      } else {
        next(new AppError("Confirm your email first", 404));
      }
    } else {
      next(new AppError("wrong pssword", 404));
    }
  } else {
    next(new AppError("register first", 404));
  }
});

const verify = catchAsyncError(async (req, res, next) => {
  let updated = await userModel.findOneAndUpdate(
    { email: req.email },
    { confirmedEmail: true },
    { new: true }
  );
  updated.password = undefined;
  res.json({ message: "verified", updated });
});

const forgetPassword = catchAsyncError(async (req, res, next) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    let resetCode = Math.floor(100000 + Math.random() * 900000);
    user.resetCode = resetCode;
    await user.save();
    sendMAil({ email: email, operation: "reset", code: resetCode });
    res.json({ message: "email sent" });
  } else {
    next(new AppError("email not registered", 404));
  }
});

const verifyResetcode = catchAsyncError(async (req, res, next) => {
  let email = req.body.email;
  let user = await userModel.findOne({ email });
  if (req.body.resetCode == user.resetCode && user.resetCode != "") {
    let token = jwt.sign(
      {
        email: email,
        oper: "reset",
      },
      process.env.SECRET_KEY
    );
    user.resetCode = " ";
    await user.save();
    res.json({ message: "Code correct", token });
  } else {
    next(new AppError("Wrong code", 404));
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  let email = req.email;
  let user = await userModel.findOne({ email });
  if (user) {
    let password = req.body.newPassword;
    if (bcrypt.compareSync(password, user.password)) {
      next(new AppError("Same old password"), 404);
    } else {
      let hashedPassword = bcrypt.hashSync(
        password,
        Number(process.env.ROUNDS)
      );
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "user updated" });
    }
  } else {
    next(new AppError("user not found"));
  }
});

const changePass = catchAsyncError(async (req, res, next) => {
  let { oldPass, newPass } = req.body;
  let check = await userModel.findById(req.userId);
  if (check) {
    let matched = bcrypt.compareSync(oldPass, check.password);
    if (matched) {
      let newPassword = bcrypt.hashSync(newPass, Number(process.env.ROUNDS));
      check.password = newPassword;
      await check.save();
      res.json({ message: "password changed" });
    } else {
      next(new AppError("wrong old password", 404));
    }
  } else {
    next(new AppError("user not found", 404));
  }
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  let { sort, pageNo, limit, filter } = req.body;
  if (filter) {
    if (sort) {
      let obj = {};
      let arr = sort.split(":");
      obj[arr[0]] = arr[1] * 1;
      sort = obj;
    } else {
      sort = { createdAt: 1 };
    }

    pageNo <= 0 || !pageNo ? (pageNo = 1) : pageNo * 1;
    limit <= 0 || !limit ? (limit = 0) : limit * 1;
    let skipItems = (pageNo - 1) * limit;
    let aggr = [{ $skip: skipItems }];
    limit != 0 && aggr.push({ $limit: limit });

    if (filter.name) {
      filter.name = { $regex: filter.name, $options: "i" };
    }
    if (filter._id) {
      filter._id = mongoose.Types.ObjectId(filter._id);
    } else if (filter["patientInfo.reservedDoctors"]) {
      filter["patientInfo.reservedDoctors"] = mongoose.Types.ObjectId(
        filter["patientInfo.reservedDoctors"]
      );
    }

    let users = await userModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: sort,
      },
      {
        $facet: {
          totalRecords: [
            {
              $count: "total",
            },
          ],
          data: aggr,
        },
      },
    ]);

    users[0].data
      ? res.json({
          messgae: "all users",
          users: users[0].data,
          count: users[0].totalRecords[0]?.total,
        })
      : next(new AppError("user not found"));
  } else {
    const users = await userModel.findById(req.userId);
    users
      ? res.json({ messgae: "user found", users })
      : next(new AppError("user not found"));
  }
});

export {
  signUp,
  signIn,
  verify,
  forgetPassword,
  verifyResetcode,
  resetPassword,
  changePass,
  getAllUsers,
};
