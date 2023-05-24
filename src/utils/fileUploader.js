import multer from "multer";
import fs from "fs";
//import { v4 as uuid } from "uuid";
import { nanoid } from "nanoid";
export const createDir = (body) => {
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
};
