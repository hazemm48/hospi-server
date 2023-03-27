import multer from "multer";
//import { v4 as uuid } from "uuid";

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

  const upload = multer({ storage: storage, fileFilter });

  return upload.single("test");
};
