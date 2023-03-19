import mongoose from "mongoose"

const generalSchema = new mongoose.Schema({
    docSpecialties:[String],
    aid:[String],
    medicine:[String],
    lab:[{
        name:String,
        price:Number
    }],
    radiation:[{
        name:String,
        price:Number
    }]
},{
    timestamps:true
})

const generalModel=mongoose.model("General",generalSchema)

export default generalModel