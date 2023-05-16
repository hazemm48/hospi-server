import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
    name :String,
    category :String,
    fees :String,
    available:{
        type:Boolean,
        default:true
    }
})

const labModel = mongoose.model('Lab',labSchema)

export default labModel;