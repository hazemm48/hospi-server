import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: {
      name: {
        type: String,
        enum: ['self medicine', 'women care', 'men care'],
      },
      subcategories: [{
        type: String,
        enum: ['Pain relief' , 'first aid' , 'mother care']
      }]
    },
    type: {
      type: String,
      enum: ['tablet', 'capsule', 'syrup'],
    },
    quantity: Number,
    price: Number,
    sold : {
        type : Number,
        default : 0
    },
  });
  


  const medicineModel = mongoose.model('Medicine',medicineSchema)

export default medicineModel;