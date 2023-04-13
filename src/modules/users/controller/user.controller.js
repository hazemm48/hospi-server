import userModel from "../../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMAil } from "../../../services/sendMail.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

const signUp =asyncHandler( async (req, res,next) => {
  let all = req.body;
  let query = {};
  if (all.phone) {
    query.phone = all.phone;
  }
  if (all.email) {
    query.email = all.email;
  }
  let check = await userModel.findOne({
    $or: [{ phone: query.phone }, { email: query.email }],
  });
  if (check) {
    res.status(200).json({ message: "already registered" });
    // next(new Error("already registered",{cause:409}))
  } else {
    let hashedPass = bcrypt.hashSync(all.password, Number(process.env.ROUNDS));
    all.password = [hashedPass, all.password];
    if (all.role == "patient") {
      let added = await userModel.insertMany(all);
      sendMAil({ email: all.email, operation: "verify" });
      res.status(200).json({ message: "patient added", added });
      
    } else if (all.role == "doctor" && req.role == "admin") {
      let added = await userModel.insertMany(all);
      res.status(200).json({ message: "doctor added", added });
     
    } else if (all.role == "admin" && req.email == process.env.ADMIN) {
      let added = await userModel.insertMany(all);
      res.status(200).json({ message: "admin added", added });
      
    } else {
      res.json({ message: "not authorized" });
    }
  }
});

const verify =asyncHandler( async (req, res) => {
  let updated = await userModel.findOneAndUpdate(
    { email: req.email },
    { confirmedEmail: true },
    { new: true }
  );
  updated.password = undefined;
  res.json({ message: "verified", updated });
});

const forgetPassword =asyncHandler( async (req, res) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    let resetCode = Math.floor(100000 + Math.random() * 900000);
    let updated = await userModel.findOneAndUpdate({email},{resetCode})
    sendMAil({ email: email, operation: "reset", code: resetCode });
    res.json({ message: "email sent" ,updated});
  } else {
    res.json({ message: "email not registered" });
  }
});

const verifyResetCode =asyncHandler( async (req, res) => {
  let code = req.body.resetCode;
  let email = req.body.email;
  let user = await userModel.findOne({ email });
  console.log(user);
  if (code == user.resetCode && user.resetCode != "") {
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
    res.json({ message: "Wrong code" });
  }
});

const resetPassword =asyncHandler( async (req, res,next) => {
  let email = req.email;
  let user = await userModel.findOne({ email });
  if (user) {
    let password = req.body.newPassword;
    if(user.password[1]==password){
    res.json({ message: "Same old password"});
    }else{
    let hashedPassword = bcrypt.hashSync(password, Number(process.env.ROUNDS));
    user.password[0] = hashedPassword;
    user.password[1] = password;
    user.save()
    res.json({ message: "user updated" });
    
  }
  } else {
    // res.json({ message: "user not found" });
    next(new Error("user not found",{cause:404}))
  }
});

const signIn =asyncHandler( async (req, res,next) => {
  let { email, phone, password, rememberMe } = req.body;
  let query = {};
  if (phone) {
    query.phone = phone;
  } else if (email) {
    query.email = email;
  }
  let check = await userModel.findOne(query);
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
              isLoggedIn:true
            },
            process.env.SECRET_KEY
          );
          // res.json({ message: "welcome", token });
          next(new Error("welcome",{cause:200}))
        } else {
          let token = jwt.sign(
            {
              userId: check._id,
              name: check.name,
              email: email,
              role: check.role,
              isLoggedIn:true
            },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
          );
          check.isLoggedIn=true
          check.save()
          // res.json({ message: "welcome", token });
          next(new Error("welcome",{cause:200}))
        }
      } else {
        res.json({ message: "Confirm your email first" });
      }
    } else {
      res.json({ message: "wrong password" });
    }
  } else {
    res.json({ message: "register first" });
  }
});

const changePass =asyncHandler( async (req, res) => {
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
      res.json({ message: "wrong old password" });
    }
  } else {
    res.json({ message: "wrong user" });
  }
});

export {
  signUp,
  signIn,
  verify,
  forgetPassword,
  verifyResetCode,
  resetPassword,
};
