import mongoose from "mongoose";

const surgerySchema = new mongoose.Schema(
    {
        patientName:String,
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
        roomNum:Number
});

const surgeryModel = mongoose.model("Surgery",surgerySchema);

export default surgeryModel;