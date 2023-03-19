import multer from "multer";
import { nanoid } from "nanoid";

export const myMulter = () =>{
     const storage = multer.diskStorage({
        destination:function (req,file,cb) {
            cb(null,'uploads')
        },
        filename:function (req,file,cb) {
            cb(null,nanoid()+"_"+file.originalname)
        }
    })

    function fileFilter (req, file, cb) {

        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted
      if(file.mimetype == "image/png" ||file.mimetype == "image/jpeg"||file.mimetype == "image/jpg"){
        cb(null, true)
      }else{
        cb(null, false)
      }
       
      
      }    
    
    const upload = multer({storage,dest:"/uploads/",fileFilter})
    return upload
} 