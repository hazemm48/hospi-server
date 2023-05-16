import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    docId: {  
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    day: String,
    time: {
      from: String,
      to: String,
    },
    appointments: [
      {
        date: Date,
        reserveId: [
          {
            type: mongoose.Types.ObjectId,
            ref: "Reservation",
          },
        ],
      },
    ],
    limit: Number,
  },
  {
    timestamps: true,
  }
);

const scheduleModel = mongoose.model("Schedule", scheduleSchema);

export default scheduleModel;
