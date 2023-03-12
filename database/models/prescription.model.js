import mongoose from "mongoose";

const prescSchema = new mongoose.Schema({
    description:String,
    patientId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    reserveId:{
        type: mongoose.Types.ObjectId,
        ref: "Reservation",
      },
})

const prescModel = mongoose.model('Prescription',medicineSchema)

export default prescModel;