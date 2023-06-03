import userModel from "../../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMAil } from "../../../services/sendMail.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import AppError from "../../../utils/AppError.js";
import { addDocToRoom } from "../../room/controller/room.controller.js";

const signUp = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let check = await userModel.findOne({ email: all.email });
  if (check) {
    next(new AppError("already registered", 404));
  } else {
    let hashedPass = bcrypt.hashSync(all.password, Number(process.env.ROUNDS));
    all.password = [hashedPass, all.password];
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
    let matched = bcrypt.compareSync(password, check.password[0]);
    if (matched) {
      if (check.confirmedEmail == true) {
        let token = "";
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
        }
        check.isLoggedIn = true;
        check.save();
        res.json({ message: "welcome", token, user: check });
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
    if (user.password[1] == password) {
      next(new AppError("Same old password"), 404);
    } else {
      let hashedPassword = bcrypt.hashSync(
        password,
        Number(process.env.ROUNDS)
      );
      user.password[0] = hashedPassword;
      user.password[1] = password;
      user.save();
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
    let matched = bcrypt.compareSync(oldPass, check.password[0]);
    if (matched) {
      let newPassword = bcrypt.hashSync(newPass, Number(process.env.ROUNDS));
      check.password[0] = newPassword;
      check.password[1] = newPass;
      check.save();
      res.json({ message: "password changed" });
    } else {
      next(new AppError("wrong old password", 404));
    }
  } else {
    next(new AppError("user not found", 404));
  }
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  let { role, id, email, phone, sort, pageNo, limit, speciality, filter } =
    req.body;
  console.log(req, "sd");
  pageNo <= 0 || !pageNo ? (pageNo = 1) : pageNo * 1;
  limit <= 0 || !limit ? (limit = 0) : limit * 1;
  let skipItems = (pageNo - 1) * limit;
  if (role) {
    if (role == "patient" || role == "doctor") {
      let find = "";
      let lengthCon = "";
      let findFilter = {
        role,
      };
      filter && (findFilter = { ...findFilter, ...filter });
      speciality
        ? ((find = userModel.find({
            ...findFilter,
            "doctorInfo.speciality": speciality,
          })),
          (lengthCon = userModel.countDocuments({
            findFilter,
            "doctorInfo.speciality": speciality,
            function(err, count) {
              return count;
            },
          })))
        : filter?.name
        ? ((find = userModel.find({
            role,
            name: { $regex: filter.name, $options: "i" },
          })),
          (lengthCon = userModel.countDocuments({
            role,
            name: { $regex: filter.name, $options: "i" },
            function(err, count) {
              return count;
            },
          })))
        : ((find = userModel.find(findFilter)),
          (lengthCon = userModel.countDocuments({
            ...findFilter,
            function(err, count) {
              return count;
            },
          })));
      const users = await find
        .skip(skipItems)
        .limit(limit)
        .collation({ locale: "en" })
        .sort(sort);
      const length = await lengthCon;
      console.log(users);
      users
        ? res.json({ messgae: `all ${role}s`, users, length })
        : next(new AppError("user not found"));
    } else if (role == "all") {
      const users = await userModel
        .find()
        .skip(skipItems)
        .limit(limit)
        .collation({ locale: "en" })
        .sort(sort);
      users
        ? res.json({ messgae: "all users", users })
        : next(new AppError("user not found"));
    } else {
      next(new AppError("invalid input"));
    }
  } else if (id) {
    const users = await userModel.findById(id);
    users
      ? res.json({ messgae: "user found", users })
      : next(new AppError("user not found"));
  } else if (email || phone) {
    console.log(email, phone);
    let query = {};
    email ? (query.email = email) : "";
    phone ? (query.phone = phone) : "";
    console.log(query);
    const users = await userModel.find(query);
    users
      ? res.json({ messgae: "user found", users })
      : next(new AppError("user not found"));
  } else if (req.userId) {
    const users = await userModel.findById(req.userId);
    users
      ? res.json({ messgae: "user found", users })
      : next(new AppError("user not found"));
  } else {
    next(new AppError("invalid input"));
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
