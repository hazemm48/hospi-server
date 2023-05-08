import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import moment from "moment-timezone";
import catchAsyncError from "../../../middleware/catchAsyncError.js";
import AppError from "../../../../utils/AppError.js";

const reserve = catchAsyncError(async (req, res, next) => {
  let all = req.body;
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
  let scheduleDayIndex = -1;
  let appointmentDateIndex = -1;

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
    let appointmentIndex = docInfo.doctorInfo.schedule[
      scheduleIndex
    ].appointments.findIndex(
      (e) => moment(e.date).format("DD-MM-YYYY") == all.date
    );
    doctor = docInfo;
    scheduleDayIndex = scheduleIndex;
    appointmentDateIndex = appointmentIndex;
  }

  let addRes = async (check) => {
    if (!check) {
      all.date = moment(all.date, "DD-MM-YYYY").format("MM-DD-YYYY");
      all.type == "doctor"
        ? (all.time =
            doctor.doctorInfo.schedule[scheduleDayIndex].time[all.time])
        : "";
      all.patientId == "" ? delete all["patientId"] : "";
      let add = await reserveModel.insertMany(all);
      if (all.patientId) {
        let updatePat = await userModel.findByIdAndUpdate(all.patientId, {
          $push: { "patientInfo.reservations": add[0]._id },
        });
      }

      if (all.type == "doctor") {
        let appointments =
          doctor.doctorInfo.schedule[scheduleDayIndex].appointments;
        if (!appointments[appointmentDateIndex]) {
          let newAppoin = appointments.push({ date: all.date });
          appointmentDateIndex = newAppoin - 1;
          await doctor.save();
        }
        appointments[appointmentDateIndex].reserveId.push(add[0]._id);
        await doctor.save();
        let turnNumber = appointments[appointmentDateIndex].reserveId.indexOf(
          add[0]._id
        );
        add[0].turnNum = turnNumber + 1;
        await add[0].save();
      }
      res.json({ message: `${all.type} Booked`, add });
    } else {
      next(new AppError("Already booked", 404));
    }
  };

  if (reserves.length < allRes) {
    if (resDayLength.length < resPerDay) {
      if (all.type == "doctor") {
        if (scheduleDayIndex >= 0) {
          if (
            doctor.doctorInfo.schedule[scheduleDayIndex].limit >=
              (doctor.doctorInfo.schedule[scheduleDayIndex].appointments[
                appointmentDateIndex
              ]?.reserveId.length - 1 || 0) &&
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
        } else {
          next(new AppError("no such day in schedule", 404));
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
  let { filter, sort, limit, count } = req.body;
  limit <= 0 || !limit ? (limit = 0) : limit;
  limit = limit * 1 || 0;
  if (req.role == "patient") {
    !filter.patientId ? (filter.patientId = req.userId) : {};
  }
  let length = "";
  const reservations = await reserveModel.find(filter).sort(sort).limit(limit);
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
        if (resDate.diff(date, "minutes") > 120 || req.role == "admin") {
          let patient = await userModel.findByIdAndUpdate(
            reserve.patientId,
            { $pull: { "patientInfo.reservations": resId } },
            { new: true }
          );
          let doctor = await userModel.findById(reserve.doctorId);
          let scheduleDayIndex = doctor.doctorInfo.schedule.findIndex(
            (e) => e.day == reserve.day
          );
          let appointments =
            doctor.doctorInfo.schedule[scheduleDayIndex].appointments;
          appointments.pull(resId);
          doctor.save();
          await reserveModel.deleteOne({ _id: resId });
          let turnUpdate = appointments.map(async (e, index) => {
            let reserveUpdate = await reserveModel.findById(e);
            reserveUpdate.turnNum = index + 1;
            await reserveUpdate.save();
          });
          res.json({ message: "reservation cancelled", patient });
        } else {
          res.json({ message: "can't cancel reservation" });
        }
      } else {
        let patient = await userModel.findByIdAndUpdate(
          req.userId,
          { $pull: { "patientInfo.reservations": resId } },
          { new: true }
        );
        await reserveModel.deleteOne({ _id: resId });
        res.json({ message: "reservation cancelled", patient });
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
  console.log(details);
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

export { reserve, getReserve, cancelReserve, adminRes, editReserve };
