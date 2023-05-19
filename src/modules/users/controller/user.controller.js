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
      res.json({ message: "patient added", added });
    } else if (all.role == "doctor" && req.role == "admin") {
      all.confirmedEmail = true;
      let added = await userModel.insertMany(all);
      addDocToRoom({ roomId: all.roomId, docId: added._id });
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

const signIn = catchAsyncError(async (req, res, next) => {
  let gg = () => {
    let x = ["hi", "bye", "sds"];
    let y = x.findIndex((e) => e == "hs");
    let n = x[y];
    let c = x.push("fd");
    console.log(n, y, c);
  };
  console.log(gg());
  let { email, password, rememberMe } = req.body;
  let check = await userModel.findOne({ email });
  if (check) {
    let matched = bcrypt.compareSync(password, check.password[0]);
    if (matched) {
      if (check.confirmedEmail == true) {
        if (rememberMe == true) {
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
          res.json({ message: "welcome", token });
        } else {
          let token = jwt.sign(
            {
              userId: check._id,
              name: check.name,
              email: email,
              role: check.role,
              isLoggedIn: true,
            },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
          );
          check.isLoggedIn = true;
          check.save();
          res.json({ message: "welcome", token });
        }
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

export {
  signUp,
  signIn,
  verify,
  forgetPassword,
  verifyResetcode,
  resetPassword,
  changePass,
};
