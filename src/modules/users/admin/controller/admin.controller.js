import userModel from "../../../../../database/models/user.model.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
    if (req.role == "admin"){
    let {role} = req.body
        if (role){
        const users = await userModel.find({role})
        res.json({ messgae: `all ${role}s`,length:users.length, users }) 
        }else{
        const users = await userModel.find()
        res.json({ messgae: "all users", length:users.length,users }) 
        }
    }else{
        res.json({ messgae: "you are not authorized"}) 
    }
    
  };

  const addUser = async (req,res)=>{
    let all=req.body

    let hhg = async (check)=>{
        if (check) {
        res.json({ message: "already registered" });
      } else {
        let hashedPass = bcrypt.hashSync(all.password, Number(process.env.ROUNDS));
        all.password=[hashedPass,all.password]
        let added = await userModel.insertMany(all);
        res.json({ message: "user added", added });
      }
      }

    if(all.phone){
        let check = await userModel.findOne({"phone":all.phone})
        hhg(check)
      }else if(all.email){
        let check = await userModel.findOne({"email":all.email})
        hhg(check)
      }  
  }


  export {
    getAllUsers,
    addUser
  }
