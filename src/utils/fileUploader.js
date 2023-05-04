import multer from "multer";
// import { nanoid } from "nanoid";
//import { v4 as uuid } from "uuid";

// export const storage = multer.diskStorage({
//   destination:function(req,file,cb){
//     cb(null,'uploads')
//   },
//   filename:function(req,file,cb){
//     cb(null,nanoid()+"_"+file.originalname)
//   }
// })


export const fileUpload = () => {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    console.log(file);
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }

  const upload = multer({ storage, fileFilter });

  return upload.single("test");
};
