import mongoose from "mongoose";

const reserveSchema = new mongoose.Schema(
  {
    patName: String,
    docName: String,
    type: {
      type:String,
      enum:["doctor","lab","rad"]
    },
    name: String,
    specialty: String,
    fees:Number,
    turnNum: Number,
    date: String,
    time: String,
    phone: String,
    visitType: String,
    status:{
      type:Boolean,
      default:false
    },
    anotherPerson: {
      type:Boolean,
      default:false
    },
    room: String,
    report: {
      prescription:String,
      note:String,
      files:[String],
      link:String
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