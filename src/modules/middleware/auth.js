import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";
import catchAsyncError from "./catchAsyncError.js";
const auth = catchAsyncError((req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("Bearer") == false)) {
    next(new AppError("invalid token syntax"));
  } else {
    let token = auth.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        next(new AppError("invalid token"));
      } else {
        if (decoded.isLoggedIn == true) {
          req.userId = decoded.userId;
          req.role = decoded.role;
          req.email = decoded.email;
          next();
        } else {
          next(new AppError("not logged in"));
        }
      }
    });
  }
});

const adminAuth = catchAsyncError((req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("SIM") == false)) {
    next(new AppError("invalid token syntax"));
  } else {
    let token = auth.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        next(new AppError("invalid token"));
      } else {
        req.userId = decoded.userId;
        if (decoded.role == "admin") {
          req.role = decoded.role;
          req.email = decoded.email;
          next();
        } else {
          next(new AppError("not authorized user"));
        }
      }
    });
  }
});

const emailAuth = catchAsyncError((req, res, next) => {
  let token = req.params.email;
  if (!token) {
    next(new AppError("invalid token syntax"));
  } else {
    jwt.verify(token, process.env.TOKEN_KEY_VERIFY, (err, decoded) => {
      if (err) {
        next(new AppError("invalid token"));
      } else {
        req.email = decoded.email;
        if (decoded.code) {
          req.code = decoded.code;
        }
        next();
      }
    });
  }
});

const verifyCodeAuth = catchAsyncError((req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("Bearer") == false)) {
    next(new AppError("invalid token syntax"));
  } else {
    let token = auth.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        next(new AppError("invalid token"));
      } else {
        if (decoded.oper == "reset") {
          req.email = decoded.email;
          next();
        } else {
          next(new AppError("not authorized"));
        }
      }
    });
  }
});

export { auth, adminAuth, emailAuth, verifyCodeAuth };
