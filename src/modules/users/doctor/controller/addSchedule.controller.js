import scheduleModel from "../../../../../database/models/docSchedule.model.js";
import userModel from "../../../../../database/models/user.model.js";
import catchAsyncError from "../../../middleware/catchAsyncError.js";

const addSchedule = catchAsyncError(async (req,res,next)=>{
  let body = req.body
  console.log(body);
  let add = await scheduleModel.insertMany(body)
  let doc = await userModel.findById(body.docId)
  doc.doctorInfo.schedule.push(add[0]._id)
  doc.save()
  res.json({add})
})

const test = catchAsyncError(async (req,res,next)=>{
  let body = req.body
  let doc = await userModel.findById(body.docId).select("doctorInfo.schedule -_id").populate("doctorInfo.schedule").then(docs => {
    res.status(200).json({
        result:docs.doctorInfo.schedule
    }); 
})
})

export {
  addSchedule,
  test
}