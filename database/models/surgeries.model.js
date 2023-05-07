import mongoose from "mongoose";

const surgerySchema = new mongoose.Schema(
    {
        patientName:{
          type:String,
          required:[true,'Patient Name is required']
        },
        patientEmail:String,
        doctorName:String,
        patientId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
          doctorId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
        roomId: {
            type: mongoose.Types.ObjectId,
            ref:"Room"
        },
        surgeryName:String,
        roomNum:Number,
        date:Date,
        reservationDate:Date,
        appointmentDate:Date
});

const surgeryModel = mongoose.model("Surgery",surgerySchema);

export default surgeryModel;