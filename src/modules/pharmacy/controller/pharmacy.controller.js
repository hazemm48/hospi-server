import medicineModel from "../../../../database/models/medicine.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../utils/cloudinary.js";

const addMedicine =asyncHandler( async (req, res,next) => {
  let {medicineName,categoryMedicine,price,medicineType,stock} = req.body;
 
    const check = await medicineModel.find({medicineName});
    if (check.length) {
      res.status(400).json({ message: "Medicine already added" });
    } else {
      const added = await medicineModel.insertMany({medicineName,categoryMedicine,price,medicineType,stock});
      res.status(201).json({message:"Medicine added Successfully",added})
      // req.body.stock=req.body.totalItems;
      // req.body.soldItems=0
      // if(!req.files){
      //   next(new Error("You have to upload an image",{cause:404}))
      // }else{
      //     let {secure_Url,publicId} = await cloudinary.uploader.upload(file.path,{folder: "Medicines"})
      //     res.status(201).json({ message: "Added new medicine", added });
      // }
      
    }

});

const getMedicine =asyncHandler( async (req, res,next) => {
  
      const allMed = await medicineModel.find({});
      res.status(200).json({ message: "all Medicines", allMed });
    

});

const updateMedicine =asyncHandler( async (req, res,next) => {
  let {id} = req.params;
  let {price} =req.body;
  let medicine = await medicineModel.findById(id)
  if (!medicine) {
    next(new Error("Medicine Not found",{cause:404}))
  } else {
    let updatedMedicine = await medicineModel.findByIdAndUpdate({_id:id},{price:price},{new:true})
    res.status(200).json({message:"Updated",updatedMedicine})
  }

});

const deleteMedicine =asyncHandler( async (req, res,next) => {
 
    const { _id } = req.body;
    const deleted = await pharmaModel.deleteOne(_id);
    res.status(200).json({ message: "Deleted", deleted });

});

export { deleteMedicine, addMedicine, getMedicine, updateMedicine };
