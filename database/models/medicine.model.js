import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name : {
        type:String,
    },
    image:{
        type:String,
        required:[true,"Medicine image is required"]
    },
    publicId: {
        type:String
    },
    category :String,
    price :String,
    description :String,
    type:String,
    quantity:String,
    available:{
        type:Boolean,
        default:false
    }
})

const medicineModel = mongoose.model('Pharma',medicineSchema)

export default medicineModel;