import jwt from "jsonwebtoken";
import { asyncHandler } from "../../services/asyncHandler.js";

const auth = (req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("Bearer") == false)) {
    res.json({ message: "invalid token syntax" });
  } else {
    let token = auth.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        if(decoded.isLoggedIn==true){
        req.userId = decoded.userId;
        req.role=decoded.role
        next();
        }else{
          res.json({ message: "not logged in" });
        }
        
      }
    });
  }
};

const adminAuth = (req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("SIM") == false)) {
    res.json({ message: "invalid token syntax" });
  } else {
    let token = auth.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        req.userId = decoded.userId;
        if (decoded.role == "admin") {
          req.role=decoded.role
          req.email=decoded.email
          next();
        }else{
          res.json({ message: "not authorized user" });
        }      
      }
    });
  }
};

const emailAuth = (req, res, next) => {
  let token = req.params.email;
  if (!token) {
    res.json({ message: "invalid token syntax" });
  } else {
    jwt.verify(token, process.env.TOKEN_KEY_VERIFY, (err, decoded) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        req.email = decoded.email;
        if (decoded.code) {
          req.code = decoded.code;
        }
        next();
      }
    });
  }
};

const verifyCodeAuth = (req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("Bearer") == false)) {
    res.json({ message: "invalid token syntax" });
  } else {
    let token = auth.split(" ")[1]
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        if (decoded.oper=="reset") {
          req.email = decoded.email;
          next();
        }else{
          res.json({ message: "not authorized" });
        }
        
      }
    });
  }
};


export {auth,adminAuth,emailAuth,verifyCodeAuth} ;