import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import moment from "moment-timezone";
import catchAsyncError from "../../../middleware/catchAsyncError.js";
import AppError from "../../../../utils/AppError.js";
import mongoose from "mongoose";
import productModel from "../../../../../database/models/product.model.js";

const reserve = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let [apLength, resPerDay, allRes] = [4, 7, 10];
  req.role == "patient" ? (all.patientId = req.userId) : "";
  let reserves = reserveModel.find({
    type: all.type,
    status: false,
    patientId: all.patientId,
  });
  all.patientId ? (reserves = await reserves) : (reserves = []);
  let resDayLength = reserves.filter((e) => {
    return e.createdAt.toLocaleDateString() == new Date().toLocaleDateString();
  });

  let anotherPersonLength = reserves.filter((e) => {
    return (
      e.anotherPerson == true && moment(e.date).format("DD-MM-YYYY") == all.date
    );
  });
  let doctor = {};
  let scheduleDay = "";
  let docApps = [];
  let product = {};

  if (all.type == "doctor") {
    if (
      all.day != moment(all.date, "DD-MM-YYYY").format("dddd").toLowerCase()
    ) {
      return next(new AppError("day and date dont match", 404));
    }
    let docInfo = await userModel.findById(all.doctorId);
    if (!docInfo) {
      return next(new AppError("doctor not found", 404));
    }
    if (
      moment(docInfo.doctorInfo.unavailableDates).format("DD-MM-YYYY") ==
      all.date
    ) {
      return next(new AppError("doctor not available in this date", 404));
    }
    let scheduleIndex = docInfo.doctorInfo.schedule.findIndex(
      (e) => e.day == all.day
    );
    if (scheduleIndex < 0) {
      return next(new AppError("no such day in schedule", 404));
    } else {
      scheduleDay = docInfo.doctorInfo.schedule[scheduleIndex];
    }
    let doctorAppointments = await reserveModel
      .find({
        doctorId: all.doctorId,
        date: moment(all.date, "DDMMYYYY").format(),
      })
      .sort("createdAt");
    all.time = scheduleDay.time;
    all.turnNum = doctorAppointments.length + 1;
    doctor = docInfo;
    docApps = doctorAppointments;
  } else if (["rad", "lab"].includes(all.type)) {
    product = await productModel.findById(all.productId);
    if (!product) {
      return next(new AppError("product not found", 404));
    } else if (!product.available) {
      return next(new AppError("product not available", 404));
    }
  }

  let addRes = async (check) => {
    if (!check) {
      all.date = moment(all.date, "DD-MM-YYYY").format("MM-DD-YYYY");
      all.patientId == "" ? delete all["patientId"] : "";
      if (all.type == "doctor" && all.patientId) {
        await userModel.findByIdAndUpdate(all.patientId, {
          $addToSet: { "patientInfo.reservedDoctors": all.doctorId },
        });
      }
      let add = await reserveModel.insertMany(all);
      res.json({ message: "booked", add });
    } else {
      next(new AppError("already booked on this day", 404));
    }
  };

  let checkConditions = (e) => {
    let x = false;
    if (all.date == moment(e.date).tz("Africa/Cairo").format("DD-MM-YYYY")) {
      console.log(
        moment(e.date).tz("Africa/Cairo").format("DD-MM-YYYY"),
        moment(e.date).format("DD-MM-YYYY")
      );
      if (
        (all.anotherPerson && anotherPersonLength.length < apLength) ||
        (!all.anotherPerson && e.anotherPerson)
      ) {
        x = false;
      } else {
        x = true;
      }
    } else {
      x = false;
    }
    return x;
  };

  if (reserves.length < allRes) {
    if (resDayLength.length < resPerDay) {
      if (all.type == "doctor") {
        if (
          scheduleDay.limit >= (docApps.length - 1 || 0) &&
          doctor.doctorInfo.available == true
        ) {
          let x = false;
          let check = reserves.some((e) => {
            if (all.doctorId == e.doctorId) {
              x = checkConditions(e);
            }
            return x;
          });
          addRes(check);
        } else {
          next(new AppError("doctor schedule is full or not available", 404));
        }
      } else if (["lab", "rad"].includes(all.type)) {
        let check = reserves.some((e) => {
          return checkConditions(e);
        });
        addRes(check);
      }
    } else {
      next(new AppError("exceeded number of reservations per day", 404));
    }
  } else {
    next(new AppError("exceeded number of reservations", 404));
  }
});

const getReserve = catchAsyncError(async (req, res, next) => {
  let { filter, sort, limit, count, month, year } = req.body;
  limit <= 0 || !limit ? (limit = 0) : limit;
  limit = limit * 1 || 0;
  if (req.role == "patient") {
    !filter.patientId ? (filter.patientId = req.userId) : {};
  }
  let length = "";
  if (month) {
    let search = {};
    if (filter?.hasOwnProperty("doctorId")) {
      search.doctorId = mongoose.Types.ObjectId(filter.doctorId);
    } else if (filter?.hasOwnProperty("patientId")) {
      search.patientId = mongoose.Types.ObjectId(filter.patientId);
    }
    filter?.type ? (search.type = filter.type) : "";
    search.month = month;
    search.year = year;
    const reservations = await reserveModel.aggregate([
      { $addFields: { month: { $month: "$date" }, year: { $year: "$date" } } },
      { $match: { ...search } },
    ]);
    if (reservations) {
      res.json({ message: "all reservations", reservations });
    } else {
      next(new AppError("not found", 404));
    }
  } else {
    const reservations = await reserveModel
      .find(filter)
      .sort(sort)
      .limit(limit);
    if (count) {
      length = await reserveModel.countDocuments({
        function(err, count) {
          return count;
        },
      });
    }
    if (reservations) {
      res.json({ message: "all reservations", reservations, length });
    } else {
      next(new AppError("not found", 404));
    }
  }
});

const cancelReserve = catchAsyncError(async (req, res, next) => {
  let { resId } = req.body;
  let reserve = await reserveModel.findById(resId);
  if (reserve) {
    if (reserve.status == false) {
      if (reserve.type == "doctor") {
        let resDate = moment(
          moment(reserve.date).format("DD/MM/YYYY") + " " + reserve.time.from,
          "DD/MM/YYYY HH:mm"
        );
        let date = moment();
        console.log(date);
        console.log(resDate);

        console.log(resDate.diff(date, "minutes"));
        if (resDate.diff(date, "minutes") > 120 || req.role == "admin") {
          if (!reserve.anotherPerson) {
            await userModel.findByIdAndUpdate(reserve.patientId, {
              $pull: { "patientInfo.reservedDoctors": reserve.doctorId },
            });
          }
          await reserve.remove();
          let reserveTurnUpdate = await reserveModel
            .find({
              doctorId: reserve.doctorId,
              date: reserve.date,
            })
            .sort("createdAt");
          reserveTurnUpdate.map((e, i) => {
            e.turnNum = i + 1;
          });
          await reserveModel.bulkSave(reserveTurnUpdate);
          res.json({ message: "reservation cancelled" });
        } else {
          next(new AppError("can't cancel reservation"));
        }
      } else {
        await reserve.remove();
        res.json({ message: "reservation cancelled" });
      }
    } else {
      next(new AppError("reservation status is done"));
    }
  } else {
    next(new AppError("reservation already cancelled"));
  }
});

const editReserve = catchAsyncError(async (req, res, next) => {
  let { details, id } = req.body;
  console.log(id, details);
  let reserve = await reserveModel.findByIdAndUpdate(id, details, {
    new: true,
  });
  res.json({ message: "updated", reserve });
});

const reserveOperController = (req, res, next) => {
  let params = req.params;
  if (params.oper == "reserve") {
    reserve(req, res, next);
  } else if (params.oper == "get") {
    getReserve(req, res, next);
  } else if (params.oper == "cancel") {
    cancelReserve(req, res, next);
  } else if (params.oper == "edit") {
    if (req.role == "admin") {
      editReserve(req, res, next);
    } else {
      next(new AppError("not authorized"));
    }
  } else {
    next(new AppError("wrong operation entry"));
  }
};

const checkReserveStatus = catchAsyncError(async () => {
  let reserves = await reserveModel.find({ status: false });
  let date = moment();
  reserves.map((e) => {
    let time = "24:00";
    e.time.to && (time = e.time.to);
    let resDate = moment(
      moment(e.date).format("DD/MM/YYYY") + " " + time,
      "DD/MM/YYYY HH:mm A"
    );
    if (resDate.diff(date, "minutes") <= 0) {
      e.status = true;
    }
  });
  await reserveModel.bulkSave(reserves);
});

setInterval(checkReserveStatus, 1000 * 60 * 10);

export {
  reserve,
  getReserve,
  cancelReserve,
  reserveOperController,
  editReserve,
};
