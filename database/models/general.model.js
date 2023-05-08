import mongoose from "mongoose"

const generalSchema = new mongoose.Schema({
    docSpecialities:[String],
    aid:[String],
},{
    timestamps:true
})

const generalModel=mongoose.model("General",generalSchema)

export default generalModel