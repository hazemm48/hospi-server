import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import reserveModel from "../../../../../database/models/reserve.model.js";

const generatePDF = (data) => {
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
  pdf.save("reportPrescriptione.pdf");
};

const qrCode = async (data) => {
  QRCode.toString(`hellooo`, { type: "terminal" }, function (err, url) {
    console.log(url);
  });
};

const getReport = async (req, res) => {
  let resId = req.body;
  let report = await reserveModel.findById(resId).select("report -_id");
  res.json({ message: "done", report });
};

const presc = async (req, res) => {
  let { oper, resId } = req.body;
  let reserve = await reserveModel.findById(resId);
  let data = {
    presc: reserve.report.prescription,
    patName: reserve.patName,
    docName: reserve.docName,
    date: reserve.date,
  };
  if (oper == "pdf") {
    generatePDF(data);
    res.json({ message: "pdf generated"});
  } else if (oper == "qr") {
    qrCode(data);
    res.json({ message: "qrcode generated"});
  }
};


export { presc, getReport };