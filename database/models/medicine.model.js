import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    medicineName : {
        type:String,
    },
    // image:{
    //     type:String,
    //     required:[true,"Medicine image is required"]
    // },
    publicId: {
        type:String
    },
    price :String,
    description :String,
    type:String,
    quantity:String,
    available:{
        type:Boolean,
        default:false
    },
    stock:{
        type:Number
    },
    
    soldItems:String
},{
    timestamps:true
}
);

const medicineModel = mongoose.model('Pharma',medicineSchema)

export default medicineModel;