import jwt from "jsonwebtoken";
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
        req.userId = decoded.userId;
        req.role=decoded.role
        next();
      }
    });
  }
};

const adminAuth = (req, res, next) => {
  let auth = req.headers["authorization"];
  if (!auth || (auth && auth.startsWith("Bearer") == false)) {
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
          next();
        }else{
          res.json({ message: "not authorized user" });
        }      
      }
    });
  }
};



export {auth,adminAuth} ;