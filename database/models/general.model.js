import mongoose from "mongoose"

const generalSchema = new mongoose.Schema({
    specialities:[String]
},{
    timestamps:true
})

const generalModel=mongoose.model("General",generalSchema)

export default generalModel