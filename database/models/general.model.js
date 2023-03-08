import mongoose from "mongoose"

const generalSchema = new mongoose.Schema({
    specialties:[String],
    rooms:[String],
    aid:[{
        title:String,
        desc:String,
        link:String
    }],
    medicine:[String]
},{
    timestamps:true
})

const generalModel=mongoose.model("General",generalSchema)

export default generalModel