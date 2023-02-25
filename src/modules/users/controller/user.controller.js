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
    if (check) {
      res.json({ message: "already registered" });
    } else {
      let hashedPass = bcrypt.hashSync(all.password, 8);
      all.password=[hashedPass,all.password]
      let added = await userModel.insertMany(all);
      res.json({ message: "user added", added });
    }
}

const signIn = async (req, res) => {
    let { email,phone, password } = req.body;
    let query = {}
    if(phone){
      query.phone=phone
    }else if(email){
      query.email=email
    }
    let check = await userModel.findOne(query);
    console.log(query,check)
    if (check) {
      let matched = bcrypt.compareSync(password, check.password[0]);
      if (matched) {
        let token = jwt.sign(
          { userId: check._id, name: check.name, email: email , phone:phone},
          process.env.SECRET_KEY
        );
        res.json({ message: "welcome", token });
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