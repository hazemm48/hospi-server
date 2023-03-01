import userModel from "../../../../database/models/user.model.js"
import patientModel from "../../../../database/models/patient.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const signUp = async(req,res)=>{
    let all=req.body
    let query = {}
    if(all.phone){
      query.phone=all.phone
    }
    if(all.email){
      query.email=all.email
    }
    let check = await userModel.findOne({$or:[{"phone":query.phone},{"email":query.email}]});
    if (check) {
      res.json({ message: "already registered" });
    } else {
      let hashedPass = bcrypt.hashSync(all.password,Number(process.env.ROUNDS));
      all.password=[hashedPass,all.password]
      let added = await userModel.insertMany(all);
      all.main = added[0]._id.toHexString()
      let patientInfo = await patientModel.insertMany(all)
      all.info=patientInfo[0]._id.toHexString()
      let userInfo = await userModel.findByIdAndUpdate(added[0]._id,{patientInfo:all.info},{new:true})
      res.json({ message: "user added", userInfo,patientInfo });
    }
}

const signIn = async (req, res) => {
    let { email,phone, password, rememberMe } = req.body;
    let query = {}
    if(phone){
      query.phone=phone
    }else if(email){
      query.email=email
    }
    let check = await userModel.findOne(query);
    if (check) {
      let matched = bcrypt.compareSync(password, check.password[0]);
      if (matched) {
        if (rememberMe == true) {
          let token = jwt.sign(
            { userId: check._id, name: check.name, email: email, role:check.role },
            process.env.SECRET_KEY
          );
          res.json({ message: "welcome", token });
        } else {
          let token = jwt.sign(
            { userId: check._id, name: check.name, email: email, role:check.role  },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
          );
          res.json({ message: "welcome", token });
        }
      } else {
        res.json({ message: "wrong pssword" });
      }
    } else {
      res.json({ message: "register first" });
    }
  };




export {
    signUp,
    signIn
}