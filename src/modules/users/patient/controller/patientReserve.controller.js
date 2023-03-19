import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import moment from "moment";

const reserve = async (req, res) => {
  let all = req.body;
  let reserves = await reserveModel.find({
    patientId: req.userId,
    type: all.type,
    status: false,
  });
  let doctor = await userModel.findById(all.doctorId);
  let scheduleArray = doctor.doctorInfo.schedule;
  let scheduleDayIndex = scheduleArray.findIndex((e) => e.day == all.date);
  let resDayLength = reserves.filter((e) => {
    return e.createdAt.toLocaleDateString() == new Date().toLocaleDateString();
  });
  let anotherPersonLength = reserves.filter((e) => {
    return e.anotherPerson == true && e.date == all.date;
  });
  if (
    doctor.doctorInfo.schedule[scheduleDayIndex].limit >=
    doctor.doctorInfo.schedule[scheduleDayIndex].appointments.length
  ) {
    if (reserves.length < 10) {
      if (resDayLength.length < 8) {
        let x = false;
        let check = reserves.some((e) => {
          if (all.doctorId == e.doctorId) {
            if (all.date == e.date) {
              if (
                (all.anotherPerson == true && anotherPersonLength.length < 4) ||
                (all.anotherPerson == false && e.anotherPerson == true)
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
        if (!check) {
          all.patientId = req.userId;
          let add = await reserveModel.insertMany(all);
          let updatePat = await userModel.findByIdAndUpdate(req.userId, {
            $push: { "patientInfo.reservations": add[0]._id },
          });
          doctor.doctorInfo.schedule[scheduleDayIndex].appointments.push(
            add[0]._id
          );
          doctor.save();
          res.json({ message: "booked", add });
        } else {
          res.json({ message: "already booked this doctor" });
        }
      } else {
        res.json({ message: "exceeded number of reservations per day " });
      }
    } else {
      res.json({ message: "exceeded number of reservations" });
    }
  } else {
    res.json({ message: "doctor schedule is full" });
  }
};

const getReserve = async (req, res) => {
  let all = req.body;
  const patient = await userModel.findById(req.userId);
  const reservations = await reserveModel.find({ patientId: req.userId });
  let condition = (con) => {
    return reservations.filter((e) => {
      if (e.type == con) {
        return e;
      }
    });
  };
  if (all.oper == "all") {
    res.json({ message: "all reservations", reservations });
  } else if (["doctor", "lab", "rad"].includes(all.oper)) {
    let reserve = condition(all.oper);
    res.json({ message: `all ${all.oper} reservations`, reserve });
  } else {
    res.json({ message: "invalid input" });
  }
};

const cancelReserve = async (req, res) => {
  let { resId } = req.body;
  let reserve = await reserveModel.findById(resId);
  if (reserve) {
    let resDate = moment(reserve.date + " " + reserve.time, "DD/MM/YYYY HH:mm");
    let date = moment();
    if (resDate.diff(date, "minutes") > 120) {
      let patient = await userModel.findByIdAndUpdate(
        req.userId,
        { $pull: { "patientInfo.reservations": resId } },
        { new: true }
      );
      let doctor = await userModel.findById(reserve.doctorId);
      let scheduleDayIndex = doctor.doctorInfo.schedule.findIndex(
        (e) => e.day == reserve.date
      );
      doctor.doctorInfo.schedule[scheduleDayIndex].appointments.pop(resId);
      doctor.save();
      await reserveModel.deleteOne({ _id: resId });
      res.json({ message: "reservation cancelled", patient });
    } else {
      res.json({ message: "can't cancel reservation" });
    }
  } else {
    res.json({ message: "reservation already cancelled" });
  }
};

export { reserve, getReserve, cancelReserve };
