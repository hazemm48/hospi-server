import catchAsyncError from "../../middleware/catchAsyncError.js";
import AWS from "aws-sdk";
import fs from "fs"
import message from "aws-sdk/lib/maintenance_mode_message.js";
message.suppress = true;
const s3 = new AWS.S3({
  region: "eu-central-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

export const putFile = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  let filename = req.file.filename
  let file = fs.readFileSync(req.file.path)
  console.log(filename.buffer);
  let uploaded = await s3
    .upload(
      {
        Body: file,
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: filename,
        ContentType:req.file.mimetype,
        ACL:'public-read'
      },
      (err, data) => {
        if (err) {
          console.log("erre");
          return res.status(500).json({ message: "err", err });
        }
      }
    )
    .promise();
  res.set("Content-type", "text/plain");
  res.status(200).json(uploaded);
});

export const getFile = async (req, res, next) => {
  let filename = req.params.name;
  console.log(req.params.name);

  try {
    let s3File = await s3
      .getObject({
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: filename,
      })
      .promise();

      console.log(s3File.body);

    res.set("Content-type", s3File.ContentType);
    res.json(s3File.Body).end();
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.log(`No such key ${filename}`);
      res.sendStatus(404).end();
    } else {
      console.log(error);
      res.sendStatus(500).end();
    }
  }
};

export const deleteFile = catchAsyncError(async (req, res, next) => {
  let filename = req.path.slice(1);

  await s3
    .deleteObject({
      Bucket: process.env.BUCKET,
      Key: filename,
    })
    .promise();

  res.set("Content-type", "text/plain");
  res.send("ok").end();
});
