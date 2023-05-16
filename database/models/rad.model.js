import mongoose from "mongoose";

const radSchema = new mongoose.Schema({
    name :String,
    category :String,
    fees :String,
    avairadle:{
        type:Boolean,
        default:true
    }
})

const radModel = mongoose.model('Rad',radSchema)

export default radModel;