import mongoose from "mongoose"

const noteSchema = new mongoose.Schema({
    content:String,
    createdBy:String
},{
    timestamps:true
})

const noteModel=mongoose.model("Note",noteSchema)

export default noteModel