import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import reserveModel from "../../../../../database/models/reserve.model.js";
import { asyncHandler } from "../../../../services/asyncHandler.js";
import cloudinary from "../../../../utils/cloudinary.js";

const generatePDF =asyncHandler( async (data) => {
  var pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });
  pdf.text(`Doctor name: ${data.docName}`, 20, 20);
  pdf.text(`Patient name: ${data.patName}`, 20, 30);
  pdf.text(`Date: ${data.date}`, 20, 40);
  pdf.text(`${data.presc}`, 20, 50);
  pdf.save(`./src/reportPDF/${data.resId}.pdf`);
});

const qrCode =asyncHandler( async (data) => {
  let path = `./src/reportPDF/${data.resId}.pdf`;
  let reserve = await reserveModel.findById(data.resId);
  let pdfLink = reserve.report.link;

  if (pdfLink) {
    let qr = QRCode.toString(pdfLink, { type: "svg" }, function (err, url) {
      console.log(url);
    });
    return qr;
  } else {
    generatePDF(data);
    let { secure_url } = await cloudinary.uploader.upload(path, {
      folder: "qrCode",
    });
    reserve.report.link = secure_url;
    reserve.save();
    let qr = QRCode.toString(secure_url, { type: "svg" }, function (err, url) {
      console.log(url);
    });
    return qr;
  }
});

const getReport =asyncHandler( async (req, res) => {
  let resId = req.body;
  let report = await reserveModel.findById(resId).select("report -_id");
  res.json({ message: "done", report });
});

const presc =asyncHandler( async (req, res) => {
  let { oper, resId } = req.body;
  let reserve = await reserveModel.findById(resId);
  let data = {
    presc: reserve.report.prescription,
    patName: reserve.patName,
    docName: reserve.docName,
    date: reserve.date,
    resId: resId,
  };
  if (oper == "pdf") {
    generatePDF(data);
    res.json({ message: "pdf generated" });
  } else if (oper == "qr") {
    let qr = await qrCode(data);
    res.json({ message: "qrcode generated", qr });
  }
});

export { presc, getReport };
