import userModel from "../../../../database/models/user.model.js"
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
    console.log(check);
    if (check) {
      res.json({ message: "already registered" });
    } else {
      console.log(check);
      let hashedPass = bcrypt.hashSync(all.password,Number(process.env.ROUNDS));
      all.password=[hashedPass,all.password]
      if(all.role == "patient"){
        let added = await userModel.insertMany(all);
      res.json({ message: "patient added",added});
      }else if (all.role =="doctor" && req.role == "admin" ){
        let added = await userModel.insertMany(all);
        res.json({ message: "doctor added",added});
      }else if (all.role =="admin" && req.email == process.env.ADMIN){
        let added = await userModel.insertMany(all);
        res.json({ message: "admin added",added});
      }else{
        res.json({ message: "not authorized"});
      }

      
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
    console.log(check,phone,email);
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

  const changePass = async (req, res) => {
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
  };


export {
    signUp,
    signIn
}