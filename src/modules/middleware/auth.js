import jwt from "jsonwebtoken";
import { asyncHandler } from "../../services/asyncHandler.js";

const auth =asyncHandler( (req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("Bearer") == false)) {
    next(new Error("invalid token Syntax",{cause:400}));
  } else {
    let token = auth.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
       next(new Error("invalid token",{cause:400}));
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
});

const adminAuth =asyncHandler( (req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("SIM") == false)) {
    next(new Error("invalid token Syntax",{cause:400}));
  } else {
    let token = auth.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        next(new Error("invalid token",{cause:400}));
      } else {
        req.userId = decoded.userId;
        if (decoded.role == "admin") {
          req.role=decoded.role
          req.email=decoded.email
          next();
        }else{
          next(new Error("not authorized User",{cause:403}));
        }      
      }
    });
  }
});

const emailAuth =asyncHandler( (req, res, next) => {
  let token = req.params.email;
  if (!token) {
    next(new Error("invalid token Syntax",{cause:400}));
  } else {
    jwt.verify(token, process.env.TOKEN_KEY_VERIFY, (err, decoded) => {
      if (err) {
        next(new Error("invalid token",{cause:400}));
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

const verifyCodeAuth =asyncHandler( (req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("Bearer") == false)) {
    next(new Error("invalid token Syntax",{cause:400}));
  } else {
    let token = auth.split(" ")[1]
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        next(new Error("invalid token",{cause:400}));
      } else {
        if (decoded.oper=="reset") {
          req.email = decoded.email;
          next();
        }else{
          next(new Error("not authorized",{cause:403}));
        }
        
      }
    });
  }
});


export {auth,adminAuth,emailAuth,verifyCodeAuth} ;