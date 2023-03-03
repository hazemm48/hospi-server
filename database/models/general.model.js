import mongoose from "mongoose"

const generalSchema = new mongoose.Schema({
    specialties:[String],
    rooms:[String],
    aid:[String],
    medicine:[String]
},{
    timestamps:true
})

const generalModel=mongoose.model("General",generalSchema)

export default generalModel