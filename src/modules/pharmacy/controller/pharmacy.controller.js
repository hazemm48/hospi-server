import medicineModel from "../../../../database/models/medicine.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

const addMedicine =asyncHandler( async (req, res) => {
  let all = req.body;
 
    const check = await medicineModel.findOne({ name: all.name });
    if (check) {
      res.json({ message: "Medicine already added" });
    } else {
      const added = await medicineModel.insertMany(all);
      res.json({ message: "Added new medicine", added });
    }

});

const getMedicine =asyncHandler( async (req, res) => {
  all = req.body;
 
    if (all.oper == "all") {
      const allMed = await medicineModel.find();
      res.json({ message: "all Medicines", allMed });
    } else if (!all.oper) {
      const medicine = await medicineModel.find(all);
      res.json({ message: "all medicine", medicine });
    }

});

const updateMedicine =asyncHandler( async (req, res) => {
  let all = req.body;

    const updated = await medicineModel.findByIdAndUpdate(all._id, all, {
      new: true,
    });
    res.json({ message: "Updated", updated });

});

const deleteMedicine =asyncHandler( async (req, res) => {
 
    const { _id } = req.body;
    const deleted = await pharmaModel.deleteOne(_id);
    res.json({ message: "Deleted", deleted });

});

export { deleteMedicine, addMedicine, getMedicine, updateMedicine };
