import mongoose from "mongoose";

const reserveSchema = new mongoose.Schema(
  {
    patName: String,
    docName: String,
    type: {
      type: String,
      enum: ["doctor", "lab", "rad"],
    },
    productName: String,
    speciality: String,
    fees: Number,
    turnNum: Number,
    day: String,
    date: Date,
    time: {
      from: String,
      to: String,
    },
    phone: String,
    visitType: String,
    status: {
      type: Boolean,
      default: false,
    },
    anotherPerson: {
      type: Boolean,
      default: false,
    },
    room: String,
    report: {
      prescription: String,
      note: String,
      link: String,
      files: [
        {
          name: String,
          path: String,
          _id: false,
        },
      ],
    },
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const reserveModel = mongoose.model("Reservation", reserveSchema);

export default reserveModel;
