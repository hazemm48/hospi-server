import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name : String,
    category :String,
    price :String,
    description :String,
    quantity:String,
    available:{
        type:Boolean,
        default:false
    }
})

const medicineModel = mongoose.model('Pharma',medicineSchema)

export default medicineModel;