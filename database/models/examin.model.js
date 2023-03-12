import mongoose from "mongoose";

const examinSchema = new mongoose.Schema({
name:String,
price:String,
category:String,
date:Date,
anotherPerson:Boolean,
phone:String,
patientId :{
    type : mongoose.Types.ObjectId,
    ref:"User"
},
}
)

const examinModel = mongoose.model('Examin',examinSchema)

export default examinModel;