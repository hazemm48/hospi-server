import userModel from "../../../../../database/models/user.model.js";
import reserveModel from "../../../../../database/models/reserve.model.js";
import moment from "moment";

const reserve = async (req, res) => {
  let all = req.body;
  let [apLength, resPerDay, allRes] = [4, 6, 10];
  let reserves = await reserveModel.find({
    patientId: req.userId,
    type: all.type,
    status: false,
  });

  let resDayLength = reserves.filter((e) => {
    return e.createdAt.toLocaleDateString() == new Date().toLocaleDateString();
  });
  let anotherPersonLength = reserves.filter((e) => {
    return e.anotherPerson == true && e.date == all.date;
  });
  let doctor = {};
  let scheduleDayIndex = -1;
  if (all.type == "doctor") {
    let docInfo = await userModel.findById(all.doctorId);
    let scheduleIndex = docInfo.doctorInfo.schedule.findIndex(
      (e) =>
        e.day == all.date && all.time >= e.time.from && all.time < e.time.to
    );
    doctor = docInfo;
    scheduleDayIndex = scheduleIndex;
  }

  let addRes = async (check) => {
    if (!check) {
      all.patientId = req.userId;
      let add = await reserveModel.insertMany(all);
      let updatePat = await userModel.findByIdAndUpdate(req.userId, {
        $push: { "patientInfo.reservations": add[0]._id },
      });
      if (all.type == "doctor") {
        let appointments =
          doctor.doctorInfo.schedule[scheduleDayIndex].appointments;
        appointments.push(add[0]._id);
        doctor.save();
        let turnNumber = appointments.indexOf(add[0]._id);
        add[0].turnNum = turnNumber + 1;
        add[0].save();
      }
      res.json({ message: `${all.type} Booked`, add });
    } else {
      res.json({ message: "Already booked" });
    }
  };

  if (reserves.length < allRes) {
    if (resDayLength.length < resPerDay) {
      if (all.type == "doctor") {
        if (scheduleDayIndex >= 0) {
          if (
            doctor.doctorInfo.schedule[scheduleDayIndex].limit >=
              doctor.doctorInfo.schedule[scheduleDayIndex].appointments
                .length &&
            doctor.doctorInfo.available == true
          ) {
            let x = false;
            let check = reserves.some((e) => {
              if (all.doctorId == e.doctorId) {
                if (all.date == e.date) {
                  if (
                    (all.anotherPerson == true &&
                      anotherPersonLength.length < apLength) ||
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
            addRes(check);
          } else {
            res.json({ message: "doctor schedule is full or not available" });
          }
        } else {
          res.json({ message: "no such date in schedule" });
        }
      } else if (all.type == "lab" || all.type == "rad") {
        let x = false;
        let check = reserves.some((e) => {
          if (all.date == e.date) {
            if (
              (all.anotherPerson == true &&
                anotherPersonLength.length < apLength) ||
              (all.anotherPerson == false && e.anotherPerson == true)
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
      res.json({ message: "exceeded number of reservations per day " });
    }
  } else {
    res.json({ message: "exceeded number of reservations" });
  }
};

const getReserve = async (req, res) => {
  let all = req.body;
  const patient = await userModel.findById(req.userId);
  const reservations = await reserveModel.find({ patientId: req.userId });
  if (all.oper == "all") {
    if (all.status == false) {
      const comingRes = reservations.filter((e) => {
        return e.status == false;
      });
      res.json({ message: "all upcoming reservations", comingRes });
    } else if (all.status == true) {
      const historyRes = reservations.filter((e) => {
        return e.status == true;
      });
      res.json({ message: "all history reservations", historyRes });
    } else {
      res.json({ message: "all reservations", reservations });
    }
  } else if (["doctor", "lab", "rad"].includes(all.oper)) {
    let reserves = reservations.filter((e) => {
      if (e.type == all.oper) {
        return e;
      }
    });
    if (all.status == true) {
      const historyRes = reserves.filter((e) => {
        return e.status == true;
      });
      res.json({ message: "all history reservations", historyRes });
    } else if (all.status == false) {
      const comingRes = reservations.filter((e) => {
        return e.status == false;
      });
      res.json({ message: "all upcoming reservations", comingRes });
    } else {
      res.json({ message: `all ${all.oper} reservations`, reserves });
    }
  } else {
    res.json({ message: "invalid input" });
  }
};

const cancelReserve = async (req, res) => {
  let { resId } = req.body;
  let reserve = await reserveModel.findById(resId);
  if (reserve) {
    if (reserve.status == false) {
      if (reserve.type == "doctor") {
        let resDate = moment(
          reserve.date + " " + reserve.time,
          "DD/MM/YYYY HH:mm"
        );
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
};

export { reserve, getReserve, cancelReserve };
