import mongoose from "mongoose";

const examinSchema = new mongoose.Schema({
name:String,
price:String,
category:String,
date:Date,
patientId :{
    type : mongoose.Types.ObjectId,
    ref:"User"
},
}
)

const examiModel = mongoose.model('Examination',examinSchema)

export default examiModel;