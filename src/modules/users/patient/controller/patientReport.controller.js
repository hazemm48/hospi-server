import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import reserveModel from "../../../../../database/models/reserve.model.js";
import cloudinary from "../../../../utils/cloudinary.js";
import fs from "fs";
import moment from "moment";
import catchAsyncError from "../../../middleware/catchAsyncError.js";

const generatePDF = async (resId) => {
  let data = await reserveModel.findById(resId);
  let pdfPath = `/tmp/${data._id}_presc.pdf`;
  let path = `hospi/reserves/${data.type}/${data._id}`;
  var pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });
  pdf.text(`Doctor name: ${data.docName}`, 20, 20);
  pdf.text(`Patient name: ${data.patName}`, 20, 30);
  pdf.text(`Date: ${moment(data.date).format("DD/MM/YYYY")}`, 20, 40);
  pdf.text(" ", 20, 50);
  pdf.text("Prescription :", 20, 60);
  pdf.text(" ", 20, 70);
  pdf.text(
    `${data.report.prescription ? data.report.prescription : " "}`,
    20,
    80
  );
  pdf.save(pdfPath);
  let { secure_url } = await cloudinary.uploader.upload(pdfPath, {
    folder: path,
  });
  data.report.link = secure_url;
  await data.save();
  fs.unlink(pdfPath, () => {});
  return secure_url;
};

const qrCode = async (resId) => {
  let data = await reserveModel.findById(resId);

  let pdfLink = data.report.link;

  if (pdfLink) {
    let qr = QRCode.toString(pdfLink, { type: "svg" }, function (err, url) {
      return url;
    });
    return qr;
  } else {
    let pdf = await generatePDF(resId);
    let qr = QRCode.toString(pdf, { type: "svg" }, function (err, url) {
      return url;
    });
    return qr;
  }
};

const presc = catchAsyncError(async (req, res, next) => {
  let { oper, resId } = req.body;
  if (oper == "pdf") {
    let pdf = await generatePDF(resId);
    res.json({ message: "pdf generated", pdf });
  } else if (oper == "qr") {
    let qr = await qrCode(resId);
    res.json({ message: "qrcode generated", qr });
  }
});

export { presc };
