import multer from "multer";
import { nanoid } from "nanoid";
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";

const _dirname = path.dirname(fileURLToPath(import.meta.url))

export const validationTypes = {
  image:["image/png","image/jpeg","image/jpg"],
  pdf:"application/pdf"
}

export const HME = (err,req,res,next) =>{
  if(err){
    res.json({message:"multer error",err})
  }else{
    next()
  }
}

export const myMulter = (acceptType,customPath) =>{
  if(!customPath){
    customPath = "general"
  }
  const fullPath = path.join(_dirname,`../uploads/${customPath}`)
  if(!fs.existsSync(fullPath)){
    fs.mkdirSync(fullPath,{recursive:true})
  }
     const storage = multer.diskStorage({
        destination:function (req,file,cb) {
            cb(null,`uploads`)
        },
        filename:function (req,file,cb) {
            cb(null,nanoid()+"_"+file.originalname)
        }
    })

    function fileFilter (req, file, cb) {

      if(acceptType.includes(file.mimetype)){
        cb(null, true)
      }else{
        req.imageError=true
        cb(null, false)
      }
       
      
      }    
    
    const upload = multer({storage,dest:`uploads/${customPath}`,fileFilter})
    return upload
} 