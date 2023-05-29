import multer from "multer";

export const createDir = (body) => {
  let fieldName = body.fieldName;
  let mainDir = "hospi";
  let dir = "";
  if (fieldName == "users") {
    dir = `${mainDir}/${fieldName}/${body.id}`;
    return dir;
  } else if (fieldName == "reserves") {
    dir = `${mainDir}/${fieldName}/${body.type}/${body.id}`;
    return dir;
  } else if (fieldName == "medicRecord") {
    dir = `${mainDir}/${fieldName}/${body.id}/${body.recId}`;
    return dir;
  } else if (fieldName == "firstAid") {
    dir = `${mainDir}/${fieldName}/${body.id}`;
    return dir;
  } else {
    dir = `${mainDir}/misc`;
    return dir;
  }
};

export const fileUpload = (fieldName) => {
  const storage = multer.diskStorage({});

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

  if (fieldName == "image") {
    return upload.single(fieldName);
  } else if (fieldName == "files") {
    return upload.array(fieldName, 10);
  }
};
