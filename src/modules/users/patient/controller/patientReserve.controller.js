import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import moment from "moment-timezone";
import catchAsyncError from "../../../middleware/catchAsyncError.js";
import AppError from "../../../../utils/AppError.js";
import mongoose from "mongoose";

const reserve = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  console.log(all);
  let [apLength, resPerDay, allRes] = [4, 6, 10];
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
  let scheduleDay = -1;
  let docApps = [];

  if (all.type == "doctor") {
    if (
      all.day != moment(all.date, "DD-MM-YYYY").format("dddd").toLowerCase()
    ) {
      return next(new AppError("day and date dont match", 404));
    }
    let docInfo = await userModel.findById(all.doctorId);
    let scheduleIndex = docInfo.doctorInfo.schedule.findIndex(
      (e) => e.day == all.day
    );
    if (scheduleIndex < 0) {
      return next(new AppError("no such day in schedule", 404));
    } else {
      scheduleDay = doctor.doctorInfo.schedule[scheduleIndex];
    }
    let doctorAppointments = await reserveModel
      .find({
        doctorId: all.doctorId,
        date: moment(all.date, "DDMMYYYY").format(),
      })
      .sort("createdAt");
    all.turnNum = doctorAppointments.length + 1;
    doctor = docInfo;
    docApps = doctorAppointments;
  }

  let addRes = async (check) => {
    if (!check) {
      all.date = moment(all.date, "DD-MM-YYYY").format("MM-DD-YYYY");
      all.time = scheduleDay.time;
      all.patientId == "" ? delete all["patientId"] : "";
      let add = await reserveModel.insertMany(all);
      res.json({ message: "booked", add });
    } else {
      next(new AppError("already booked", 404));
    }
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
              if (
                all.date ==
                moment(e.date).tz("Africa/Cairo").format("DD-MM-YYYY")
              ) {
                if (
                  (all.anotherPerson &&
                    anotherPersonLength.length < apLength) ||
                  (!all.anotherPerson && e.anotherPerson)
                ) {
                  x = false;
                } else {
                  x = true;
                }
              } else {
                x = false;
              }
            }
            return x;
          });
          addRes(check);
        } else {
          next(new AppError("doctor schedule is full or not available", 404));
        }
      } else if (all.type == "lab" || all.type == "rad") {
        let x = false;
        let check = reserves.some((e) => {
          if (all.date == e.date) {
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
          "DD/MM/YYYY HH:mm A"
        );
        let date = moment();
        if (resDate.diff(date, "minutes") > 120 || req.role == "admin") {
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
          res.json({ message: "can't cancel reservation" });
        }
      } else {
        await reserveModel.remove();
        res.json({ message: "reservation cancelled" });
      }
    } else {
      res.json({ message: "reservation status is done" });
    }
  } else {
    res.json({ message: "reservation already cancelled" });
  }
});

const editReserve = catchAsyncError(async (req, res, next) => {
  let { details, id } = req.body;
  let reserve = await reserveModel.findByIdAndUpdate(id, details, {
    new: true,
  });
  res.json({ message: "updated", reserve });
});

const adminRes = (req, res, next) => {
  let params = req.params;
  if (params.oper == "reserve") {
    reserve(req, res, next);
  } else if (params.oper == "get") {
    getReserve(req, res, next);
  } else if (params.oper == "cancel") {
    cancelReserve(req, res, next);
  } else if (params.oper == "edit") {
    editReserve(req, res, next);
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

setInterval(checkReserveStatus,1000*60*10)

export { reserve, getReserve, cancelReserve, adminRes, editReserve };
