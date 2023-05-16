import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
import { connection } from "./database/connection.js";
import mainRoutes from "./src/modules/main.routes.js";
import globalError from "./src/modules/middleware/globalErrorHandler.js";
import AppError from "./src/utils/AppError.js";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
connection();
app.use("/api/v1", mainRoutes);
app.use("*", (req, res, next) => {
  next(new AppError(`invalid URL ${req.originalUrl}`, 404));
});
app.use(globalError);
app.get("/", (req, res) => res.send("running"));
app.listen(3000, () => console.log("listening"));
process.on("uncaughtException", (err, req, res, next) => {
  next(err);
});
process.on("unhandledRejection", (err, req, res, next) => {
  next(err);
});
