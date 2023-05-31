import mongoose from "mongoose";

const radSchema = new mongoose.Schema({
    name :String,
    fees :String,
    available:{
        type:Boolean,
        default:true
    }
})

const radModel = mongoose.model('Rad',radSchema)

export default radModel;