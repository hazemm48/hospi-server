import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  prescription:String,
  note:String,
  files:[String],
})

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
    anotherPerson: {
      type:Boolean,
      default:false
    },
    room: String,
    report: {
      prescription:String,
      note:String,
      files:[String],
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