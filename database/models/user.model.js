import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:String,
    age:Number,
    email:String,
    password:[String],
    address:String,
    gender:String,
    authType:String,
    diseases:[String],
    specaility:String,
    bio:String,
    phone:String
})

const userModel=mongoose.model("User",userSchema)

export default userModel