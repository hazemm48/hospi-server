import multer from "multer";
import fs from "fs";
//import { v4 as uuid } from "uuid";
import { nanoid } from "nanoid";
import catchAsyncError from "./catchAsyncError.js";
/* export const createDir = (body) => {
  console.log(body);
  let fieldName = body.fieldName;
  let mainDir = "uploads";
  let dir = "";
  if (fieldName == "profilePic") {
    dir = `${mainDir}/${fieldName}/${body.id}`;
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  } else if (fieldName == "reserves") {
    dir = `${mainDir}/${fieldName}/${body.type}/${body.id}`;
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  } else if (fieldName == "medicalRec") {
  } else {
    dir = `${mainDir}/misc`;
    return dir;
  }
};

export const fileUpload = (fieldName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(file);
      console.log(req.body, "sdsad");
      cb(null, createDir(req.body));
    },
    filename: (req, file, cb) => {
      cb(null, nanoid(10) + "_" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("application/pdf")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({ storage: storage, fileFilter });

  return upload.single(fieldName);
}; */

export const createDir = (body) => {
  console.log(body);
  let fieldName = body.fieldName;
  let mainDir = "hospi";
  let dir = "";
  if (fieldName == "users") {
    dir = `${mainDir}/${fieldName}/${body.id}`;
    return dir;
  } else if (fieldName == "reserves") {
    dir = `${mainDir}/${fieldName}/${body.type}/${body.id}`;
    return dir;
  } else if (fieldName == "medicalRec") {
  } else {
    dir = `${mainDir}/misc`;
    return dir;
  }
};

export const test = catchAsyncError(async (req,res,next)=>{
  console.log(req.body);
  fileUpload(req,res,next)
})

export const fileUpload = (fieldName) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("application/pdf")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({ storage: storage, fileFilter });

  if(fieldName=="image"){
    return upload.single(fieldName);
  }else if(fieldName=="files"){
    return upload.array(fieldName,4);
  }
};


