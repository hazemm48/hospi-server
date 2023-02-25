import mongoose, { Schema } from "mongoose";
export const connection = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.connectionUrl)
    .then(() => {
      console.log("db running");
    })
    .catch((error) => {
      console.log("db error", error);
    });
};
