import mongoose from "mongoose";

export const doctorSchema = new mongoose.Schema(
  {
    age: Number,
    speciality: String,
    birthDate: Date,
    city: String,
    bio: String,
    degree:String,
    unavailableDates: [Date],
    fees: {
      followUp: Number,
      examin: Number,
    },
    schedule: [
      {
        day: String,
        time: {
          from: String,
          to: String,
        },
        limit: Number,
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    room: String,
  },
  {
    _id: false,
  }
);
